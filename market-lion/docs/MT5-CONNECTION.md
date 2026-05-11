# Connecting to MetaTrader 5 (Exness)

The Market Lion executes trades through a small **Python bridge** (`scripts/mt5_bridge.py`)
that runs alongside MetaTrader 5 and exposes a tiny REST API.

## Why a separate bridge?
The official `MetaTrader5` Python module only runs on Windows. Hosting it on a
small Windows VPS (or a Windows VM next to MT5) is the standard approach.
The Next.js app on Digital Ocean talks to the bridge over HTTPS.

## Setup (Windows VPS or local Windows)
1. Install MetaTrader 5, log in to the Exness demo account
   (Login `260842468` · Server `Exness-MT5Trial15`).
2. `pip install MetaTrader5 fastapi "uvicorn[standard]" python-dotenv`
3. Set environment variables:
   ```
   MT5_LOGIN=260842468
   MT5_SERVER=Exness-MT5Trial15
   MT5_PASSWORD=<your password>
   ```
4. `python scripts\mt5_bridge.py`
5. Verify: `curl http://localhost:8000/health`.

## Hooking it up
In the Next.js `.env` set:
```
MT5_BRIDGE_URL=https://your-mt5-host
MT5_BRIDGE_TOKEN=<long random>
```
The server-side bot orchestrator will POST `/order` only after the user's
explicit confirmation in the dashboard.
