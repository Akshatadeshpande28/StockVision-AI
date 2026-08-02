import yfinance as yf
import pandas as pd


def get_stock_data(symbol: str, period: str = "1y"):
    """
    Fetch historical stock data using Yahoo Finance.

    Supported periods:
    3mo = 3 months
    6mo = 6 months
    1y  = 1 year
    """

    allowed_periods = ["3mo", "6mo", "1y"]

    if period not in allowed_periods:
        period = "1y"

    try:
        stock = yf.Ticker(symbol)
        history = stock.history(period=period)

        if history.empty:
            return {
                "error": f"No stock data found for {symbol}"
            }

        history = history.reset_index()

        # Convert date to string for JSON response
        history["Date"] = history["Date"].astype(str)

        # Basic price analysis
        starting_price = float(history["Close"].iloc[0])
        current_price = float(history["Close"].iloc[-1])

        highest_price = float(history["High"].max())
        lowest_price = float(history["Low"].min())

        average_price = float(history["Close"].mean())
        average_volume = float(history["Volume"].mean())

        price_change = current_price - starting_price

        percentage_change = (
            (price_change / starting_price) * 100
        )

        # Historical trend
        if percentage_change > 0:
            trend = "Upward"
        elif percentage_change < 0:
            trend = "Downward"
        else:
            trend = "Neutral"

        return {
            "symbol": symbol.upper(),
            "period": period,

            "analysis": {
                "starting_price": round(starting_price, 2),
                "current_price": round(current_price, 2),
                "highest_price": round(highest_price, 2),
                "lowest_price": round(lowest_price, 2),
                "average_price": round(average_price, 2),
                "average_volume": round(average_volume, 2),
                "price_change": round(price_change, 2),
                "percentage_change": round(percentage_change, 2),
                "trend": trend
            },

            "historical_data": history[
                [
                    "Date",
                    "Open",
                    "High",
                    "Low",
                    "Close",
                    "Volume"
                ]
            ].to_dict(orient="records")
        }

    except Exception as e:
        return {
            "error": str(e)
        }


def get_multi_period_analysis(symbol: str):
    """
    Get 3-month, 6-month and 1-year
    stock analysis in a single request.
    """

    periods = {
        "3_months": "3mo",
        "6_months": "6mo",
        "1_year": "1y"
    }

    results = {}

    for label, period in periods.items():

        data = get_stock_data(symbol, period)

        if "error" in data:
            results[label] = {
                "error": data["error"]
            }
        else:
            results[label] = data["analysis"]

    return {
        "symbol": symbol.upper(),
        "analysis": results
    }
