from fastapi import FastAPI

from app.stock import (
    get_stock_data,
    get_multi_period_analysis,
)

from app.technical import get_technical_analysis

from app.fundamentals import get_fundamental_analysis

from app.charts import generate_candlestick