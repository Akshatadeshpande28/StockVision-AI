from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.stock import get_stock_data, get_multi_period_analysis
from app.charts import get_chart_data

app = FastAPI(
    title="StockVision AI",
    version="1.0.0"
)


# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to StockVision AI 🚀",
        "status": "Backend Running"
    }


@app.get("/stock/{symbol}")
def stock(symbol: str, period: str = "1y"):
    return get_stock_data(symbol, period)


@app.get("/analysis/{symbol}")
def analysis(symbol: str):
    return get_multi_period_analysis(symbol)