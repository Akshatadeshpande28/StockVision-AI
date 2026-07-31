from fastapi import FastAPI
from app.stock import (
    get_stock_data,
    get_multi_period_analysis,
    get_technical_analysis
)


app = FastAPI(
    title="StockVision AI",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Welcome to StockVision AI 🚀",
        "status": "Backend Running"
    }


@app.get("/stock/{symbol}")
def stock_analysis(symbol: str, period: str = "1y"):
    return get_stock_data(symbol, period)


@app.get("/analysis/{symbol}")
def multi_period_analysis(symbol: str):
    return get_multi_period_analysis(symbol)

@app.get("/technical/{symbol}")
def technical_analysis(symbol: str):
    return get_technical_analysis(symbol)