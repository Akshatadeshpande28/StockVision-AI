import yfinance as yf


def get_stock_data(symbol: str, period: str = "1y"):
    stock = yf.Ticker(symbol)

    history = stock.history(period=period)

    if history.empty:
        return {
            "status": "error",
            "message": f"No stock data found for {symbol}"
        }

    current_price = float(history["Close"].iloc[-1])
    start_price = float(history["Close"].iloc[0])

    percentage_change = (
        (current_price - start_price) / start_price
    ) * 100

    if percentage_change > 5:
        trend = "Bullish"
    elif percentage_change < -5:
        trend = "Bearish"
    else:
        trend = "Neutral"

    return {
        "status": "success",
        "symbol": symbol.upper(),
        "current_price": round(current_price, 2),
        "start_price": round(start_price, 2),
        "percentage_change": round(percentage_change, 2),
        "trend": trend,
        "period": period
    }


def get_multi_period_analysis(symbol: str):
    periods = {
        "1_month": "1mo",
        "3_months": "3mo",
        "6_months": "6mo",
        "1_year": "1y"
    }

    results = {}

    for name, period in periods.items():
        data = get_stock_data(symbol, period)

        if data.get("status") == "success":
            results[name] = data

    if not results:
        return {
            "status": "error",
            "message": f"No analysis available for {symbol}"
        }

    return {
        "status": "success",
        "symbol": symbol.upper(),
        "analysis": results
    }