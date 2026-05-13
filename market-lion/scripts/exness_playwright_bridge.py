#!/usr/bin/env python3
"""
Exness Playwright Bridge — manages trades via Exness Web Terminal
No MT5/MetaTrader required. Headless Chromium on the same Linux droplet.

Setup:
  pip install playwright fastapi uvicorn python-dotenv
  playwright install chromium
  python scripts/exness_playwright_bridge.py

The Next.js app calls this service at http://localhost:8001 via src/lib/brokers/exness.ts
"""

import os
import asyncio
import logging
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from playwright.async_api import async_playwright, Page, Browser
import uvicorn

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("exness_bridge")

EXNESS_WEBTERMINAL = "https://my.exness.com/webterminal/"
PORT = int(os.getenv("EXNESS_BRIDGE_PORT", "8001"))

app = FastAPI(title="Exness Playwright Bridge", version="1.0.0")

# Session pool: login → { browser, page }
_sessions: Dict[str, Dict[str, Any]] = {}
_pw_instance = None


async def get_playwright():
    global _pw_instance
    if _pw_instance is None:
        _pw_instance = await async_playwright().start()
    return _pw_instance


async def get_or_create_session(login: str, server: str, password: str) -> Page:
    if login in _sessions:
        return _sessions[login]["page"]

    pw = await get_playwright()
    browser: Browser = await pw.chromium.launch(
        headless=True,
        args=["--no-sandbox", "--disable-dev-shm-usage"]
    )
    page: Page = await browser.new_page()

    log.info(f"Opening Exness Web Terminal for {login}")
    await page.goto(EXNESS_WEBTERMINAL, wait_until="networkidle")

    # Fill login credentials
    await page.fill('input[name="login"], input[placeholder*="login" i], input[id*="login" i]', login)
    await page.fill('input[name="server"], input[placeholder*="server" i]', server)
    await page.fill('input[type="password"]', password)
    await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")')

    # Wait for trading panel to appear
    try:
        await page.wait_for_selector(
            '.trading-panel, .trade-panel, [class*="terminal"], [class*="chart"]',
            timeout=30000
        )
    except Exception:
        log.warning(f"Trading panel selector timeout for {login} — continuing anyway")

    _sessions[login] = {"browser": browser, "page": page}
    log.info(f"Session ready for {login}")
    return page


class OrderReq(BaseModel):
    login: str
    server: str
    password: str
    symbol: str       # XAUUSD
    direction: str    # BUY | SELL
    volume: float
    stop_loss: float
    take_profit: float


class CredsReq(BaseModel):
    login: str
    server: str
    password: str


@app.post("/order")
async def place_order(req: OrderReq):
    try:
        page = await get_or_create_session(req.login, req.server, req.password)

        # Try to find and click the symbol in the market watch
        try:
            await page.click(f'[data-symbol="{req.symbol}"], [title="{req.symbol}"]', timeout=5000)
        except Exception:
            log.info(f"Symbol click failed for {req.symbol}, trying search")
            search = page.locator('input[placeholder*="search" i], input[placeholder*="symbol" i]')
            if await search.count() > 0:
                await search.first.fill(req.symbol)
                await page.click(f'li:has-text("{req.symbol}"), div:has-text("{req.symbol}")', timeout=3000)

        # Open new order dialog
        new_order_btn = page.locator('button:has-text("New Order"), button:has-text("Trade"), [class*="new-order"]')
        await new_order_btn.first.click(timeout=5000)
        await asyncio.sleep(0.5)

        # Fill volume
        vol_input = page.locator('input[name="volume"], input[placeholder*="volume" i], input[id*="volume" i]')
        await vol_input.first.fill(str(req.volume))

        # Fill stop loss
        sl_input = page.locator('input[name="stopLoss"], input[placeholder*="stop" i]')
        if await sl_input.count() > 0:
            await sl_input.first.fill(str(req.stop_loss))

        # Fill take profit
        tp_input = page.locator('input[name="takeProfit"], input[placeholder*="profit" i]')
        if await tp_input.count() > 0:
            await tp_input.first.fill(str(req.take_profit))

        # Click Buy or Sell
        if req.direction.upper() == "BUY":
            btn = page.locator('button.buy, button:has-text("Buy"), [class*="buy-btn"]')
        else:
            btn = page.locator('button.sell, button:has-text("Sell"), [class*="sell-btn"]')
        await btn.first.click(timeout=5000)

        # Wait for confirmation
        try:
            await page.wait_for_selector(
                '.order-confirmed, [class*="confirmed"], [class*="success"]',
                timeout=8000
            )
        except Exception:
            pass  # Some terminals don't show explicit confirmation

        # Try to read deal ID from confirmation dialog
        deal_id = ""
        try:
            deal_id = await page.text_content('.deal-id, [class*="deal-id"], [class*="order-id"]') or ""
        except Exception:
            pass

        log.info(f"Order placed: {req.direction} {req.volume} {req.symbol} deal={deal_id}")
        return {"ok": True, "dealId": deal_id.strip(), "symbol": req.symbol, "direction": req.direction}

    except Exception as e:
        log.error(f"Order error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/positions/{login}")
async def get_positions(login: str):
    if login not in _sessions:
        return {"items": []}
    page = _sessions[login]["page"]
    try:
        rows = await page.query_selector_all('.positions-table tr[data-id], .open-trade, [class*="position-row"]')
        items = []
        for row in rows:
            deal_id = await row.get_attribute("data-id") or ""
            symbol  = ""
            volume  = ""
            pnl     = ""
            try:
                symbol = await row.text_content('.col-symbol, [class*="symbol"]') or ""
            except Exception:
                pass
            try:
                volume = await row.text_content('.col-volume, [class*="volume"]') or ""
            except Exception:
                pass
            try:
                pnl = await row.text_content('.col-pnl, [class*="pnl"], [class*="profit"]') or ""
            except Exception:
                pass
            items.append({"id": deal_id, "symbol": symbol.strip(), "volume": volume.strip(), "pnl": pnl.strip()})
        return {"items": items}
    except Exception as e:
        log.error(f"Get positions error: {e}")
        return {"items": [], "error": str(e)}


@app.delete("/positions/{login}/{deal_id}")
async def close_position(login: str, deal_id: str):
    if login not in _sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    page = _sessions[login]["page"]
    try:
        close_btn = page.locator(f'tr[data-id="{deal_id}"] button.close, tr[data-id="{deal_id}"] [class*="close"]')
        await close_btn.first.click(timeout=5000)
        try:
            await page.wait_for_selector('.close-confirmed, [class*="close-confirmed"]', timeout=8000)
        except Exception:
            pass
        return {"ok": True, "dealId": deal_id}
    except Exception as e:
        log.error(f"Close position error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/account/{login}")
async def get_account(login: str, creds: CredsReq):
    try:
        page = await get_or_create_session(creds.login, creds.server, creds.password)
        balance = ""
        equity  = ""
        try:
            balance = await page.text_content('[class*="balance"]') or ""
            equity  = await page.text_content('[class*="equity"]') or ""
        except Exception:
            pass
        return {"login": login, "balance": balance.strip(), "equity": equity.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"ok": True, "sessions": list(_sessions.keys())}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=PORT)
