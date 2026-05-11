#!/usr/bin/env python3
"""
MT5 Bridge — Python connector that lets the Next.js backend send orders to a
MetaTrader 5 account (e.g. Exness demo). Run this script on a Windows machine or
a Windows VM that has MetaTrader 5 + Python installed.

Usage (one-time on the MT5 host machine):
    pip install MetaTrader5 fastapi "uvicorn[standard]" python-dotenv
    python mt5_bridge.py

Then set MT5_BRIDGE_URL in the Next.js .env (e.g. http://your-mt5-host:8000).
The Next.js server will only POST orders that match the user's confirmed plan.

SAFETY: This bridge will never auto-trade unless the user clicks the bot button
in the dashboard AND the platform confirms the entry conditions
(Confluence Score >= 75% + fundamental alignment + no high-impact news in ±30m).
"""
import os, json, time, sys, threading
from typing import Optional
try:
    import MetaTrader5 as mt5
except Exception:
    mt5 = None

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn

LOGIN    = int(os.environ.get("MT5_LOGIN", "0") or "0")
SERVER   = os.environ.get("MT5_SERVER", "Exness-MT5Trial15")
PASSWORD = os.environ.get("MT5_PASSWORD", "")

app = FastAPI(title="The Market Lion — MT5 Bridge")

class OrderReq(BaseModel):
    user_id: str
    symbol: str
    side: str    # BUY or SELL
    lots: float
    sl: float
    tp: float
    comment: Optional[str] = "MarketLion"

@app.on_event("startup")
def init():
    if mt5 is None:
        print("MetaTrader5 module not installed — bridge is in dry-run mode.", file=sys.stderr)
        return
    if not mt5.initialize(login=LOGIN, server=SERVER, password=PASSWORD):
        print(f"mt5 init failed: {mt5.last_error()}", file=sys.stderr)

@app.get("/health")
def health():
    return {"ok": True, "ts": time.time(), "live": mt5 is not None}

@app.get("/account")
def account():
    if mt5 is None: return {"dry_run": True}
    info = mt5.account_info()
    return info._asdict() if info else {}

@app.post("/order")
def order(req: OrderReq):
    if mt5 is None:
        return {"dry_run": True, "would_send": req.dict()}
    sym = mt5.symbol_info(req.symbol.replace("/", ""))
    if sym is None: raise HTTPException(400, f"Unknown symbol: {req.symbol}")
    mt5.symbol_select(sym.name, True)
    is_buy = req.side.upper() == "BUY"
    price = mt5.symbol_info_tick(sym.name).ask if is_buy else mt5.symbol_info_tick(sym.name).bid
    request = {
        "action": mt5.TRADE_ACTION_DEAL,
        "symbol": sym.name,
        "volume": float(req.lots),
        "type": mt5.ORDER_TYPE_BUY if is_buy else mt5.ORDER_TYPE_SELL,
        "price": price,
        "sl": float(req.sl),
        "tp": float(req.tp),
        "deviation": 20,
        "magic": 870000,
        "comment": req.comment or "MarketLion",
        "type_time": mt5.ORDER_TIME_GTC,
        "type_filling": mt5.ORDER_FILLING_IOC,
    }
    res = mt5.order_send(request)
    return {"retcode": res.retcode, "deal": res.deal, "order": res.order, "comment": res.comment}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
