from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.stock import get_stock_data, get_multi_period_analysis
from app.technical import get_technical_analysis
from app.fundamentals import get_fundamental_analysis
from app.charts import generate_candlestick

app = FastAPI(
    title="StockVision AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "https://special-halibut-4jwvvq9q9pqv25rg5-5500.app.github.dev"
    ],
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
def stock_analysis(symbol: str, period: str = "1y"):
    return get_stock_data(symbol, period)


@app.get("/analysis/{symbol}")
def analysis(symbol: str):
    return get_multi_period_analysis(symbol)


@app.get("/technical/{symbol}")
def technical(symbol: str):
    return get_technical_analysis(symbol)


@app.get("/fundamentals/{symbol}")
def fundamentals(symbol: str):
    return get_fundamental_analysis(symbol)


@app.get("/chart/{symbol}")
def chart(symbol: str, period: str = "6mo"):
    return generate_candlestick(symbol, period)