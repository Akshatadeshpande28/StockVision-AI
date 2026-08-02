import yfinance as yf
import pandas as pd

def get_technical_analysis(symbol: str):
    """
    Calculate technical indicators for a stock using
    approximately 1 year of historical market data.
    """

    try:
        stock = yf.Ticker(symbol)
        history = stock.history(period="1y")

        if history.empty:
            return {
                "error": f"No stock data found for {symbol}"
            }

        close = history["Close"]
        volume = history["Volume"]

        # -------------------------
        # Moving Averages
        # -------------------------
        sma_20 = close.rolling(window=20).mean()
        sma_50 = close.rolling(window=50).mean()
        sma_200 = close.rolling(window=200).mean()

        ema_20 = close.ewm(span=20, adjust=False).mean()
        ema_50 = close.ewm(span=50, adjust=False).mean()

        # -------------------------
        # RSI - Relative Strength Index
        # -------------------------
        delta = close.diff()

        gain = delta.clip(lower=0)
        loss = -delta.clip(upper=0)

        average_gain = gain.rolling(window=14).mean()
        average_loss = loss.rolling(window=14).mean()

        rs = average_gain / average_loss
        rsi = 100 - (100 / (1 + rs))

        current_rsi = float(rsi.iloc[-1])

        if current_rsi >= 70:
            rsi_signal = "Overbought"
        elif current_rsi <= 30:
            rsi_signal = "Oversold"
        else:
            rsi_signal = "Neutral"

        # -------------------------
        # MACD
        # -------------------------
        ema_12 = close.ewm(span=12, adjust=False).mean()
        ema_26 = close.ewm(span=26, adjust=False).mean()

        macd = ema_12 - ema_26
        macd_signal_line = macd.ewm(
            span=9,
            adjust=False
        ).mean()

        current_macd = float(macd.iloc[-1])
        current_macd_signal = float(
            macd_signal_line.iloc[-1]
        )

        # -------------------------
        # Volatility
        # -------------------------
        daily_returns = close.pct_change()

        annualized_volatility = (
            daily_returns.std() * (252 ** 0.5) * 100
        )

        # -------------------------
        # 52 Week Range
        # -------------------------
        week_52_high = float(history["High"].max())
        week_52_low = float(history["Low"].min())

        current_price = float(close.iloc[-1])

        # -------------------------
        # Volume Analysis
        # -------------------------
        average_volume_20 = volume.rolling(
            window=20
        ).mean().iloc[-1]

        current_volume = float(volume.iloc[-1])

        if current_volume > average_volume_20:
            volume_signal = "Above Average"
        else:
            volume_signal = "Below Average"

        # -------------------------
        # Overall Technical Signal
        # -------------------------
        bullish_points = 0
        bearish_points = 0

        if current_price > sma_20.iloc[-1]:
            bullish_points += 1
        else:
            bearish_points += 1

        if current_price > sma_50.iloc[-1]:
            bullish_points += 1
        else:
            bearish_points += 1

        if current_price > sma_200.iloc[-1]:
            bullish_points += 1
        else:
            bearish_points += 1

        if current_macd > current_macd_signal:
            bullish_points += 1
        else:
            bearish_points += 1

        if current_rsi < 30:
            bullish_points += 1
        elif current_rsi > 70:
            bearish_points += 1

        if bullish_points > bearish_points:
            technical_signal = "Bullish"
        elif bearish_points > bullish_points:
            technical_signal = "Bearish"
        else:
            technical_signal = "Neutral"

        return {
            "symbol": symbol.upper(),

            "technical_analysis": {
                "current_price": round(current_price, 2),

                "sma_20": round(
                    float(sma_20.iloc[-1]), 2
                ),

                "sma_50": round(
                    float(sma_50.iloc[-1]), 2
                ),

                "sma_200": round(
                    float(sma_200.iloc[-1]), 2
                ),

                "ema_20": round(
                    float(ema_20.iloc[-1]), 2
                ),

                "ema_50": round(
                    float(ema_50.iloc[-1]), 2
                ),

                "rsi_14": round(current_rsi, 2),
                "rsi_signal": rsi_signal,

                "macd": round(current_macd, 2),

                "macd_signal": round(
                    current_macd_signal, 2
                ),

                "volatility_percent": round(
                    float(annualized_volatility), 2
                ),

                "52_week_high": round(
                    week_52_high, 2
                ),

                "52_week_low": round(
                    week_52_low, 2
                ),

                "current_volume": int(
                    current_volume
                ),

                "average_volume_20": round(
                    float(average_volume_20), 2
                ),

                "volume_signal": volume_signal,

                "technical_signal": technical_signal,

                "bullish_points": bullish_points,
                "bearish_points": bearish_points
            }
        }

    except Exception as e:
        return {
            "error": str(e)
        }
