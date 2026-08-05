import yfinance as yf
import plotly.graph_objects as go


def generate_candlestick(symbol: str, period: str = "6mo"):
    try:
        stock = yf.Ticker(symbol)
        history = stock.history(period=period)

        if history.empty:
            return {
                "status": "error",
                "message": "No stock data found."
            }

        fig = go.Figure(
            data=[
                go.Candlestick(
                    x=history.index,
                    open=history["Open"],
                    high=history["High"],
                    low=history["Low"],
                    close=history["Close"],
                    name="Candlestick"
                )
            ]
        )

        fig.update_layout(
            title=f"{symbol} Candlestick Chart",
            xaxis_title="Date",
            yaxis_title="Price",
            xaxis_rangeslider_visible=False,
            template="plotly_white",
            height=600
        )

        return fig.to_json()

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }