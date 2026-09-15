import yfinance as yf


def get_chart_data(symbol: str, period: str = "6mo"):
    stock = yf.Ticker(symbol)

    history = stock.history(period=period)

    if history.empty:
        return {
            "status": "error",
            "message": f"No chart data found for {symbol}"
        }

    data = []

    for date, row in history.iterrows():
        data.append({
            "date": date.strftime("%Y-%m-%d"),
            "open": round(float(row["Open"]), 2),
            "high": round(float(row["High"]), 2),
            "low": round(float(row["Low"]), 2),
            "close": round(float(row["Close"]), 2),
            "volume": int(row["Volume"])
        })

    return {
        "status": "success",
        "symbol": symbol.upper(),
        "period": period,
        "data": data
    }