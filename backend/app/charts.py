import yfinance as yf
import plotly.graph_objects as go

def generate_candlestick(symbol: str, period: str = "6mo"):

    stock = yf.Ticker(symbol)
    history = stock.history(period=period)

    if history.empty:
        return {"error": "No data found"}

    fig = go.Figure()

    fig.add_trace(
        go.Candlestick(
            x=history.index,
            open=history["Open"],
            high=history["High"],
            low=history["Low"],
            close=history["Close"],
            name="Candlestick"
        )
    )

    fig.update_layout(
        title=f"{symbol} Candlestick Chart",
        xaxis_title="Date",
        yaxis_title="Price",
        xaxis_rangeslider_visible=False
    )

    return fig.to_json()