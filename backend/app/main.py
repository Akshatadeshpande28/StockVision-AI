from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(
    title="StockVision AI",
    version="1.0.0"
)
from app.stock import (
    get_stock_data,
    get_multi_period_analysis,
)

from app.technical import get_technical_analysis

from app.fundamentals import get_fundamental_analysis

from app.charts import generate_candlestick