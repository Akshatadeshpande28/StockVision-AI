import yfinance as yf
import pandas as pd
import ta


def get_technical_analysis(symbol: str, period: str = "1y"):

    stock = yf.Ticker(symbol)

    history = stock.history(period=period)

    if history.empty:
        return {
            "status": "error",
            "message": f"No technical data found for {symbol}"
        }

    close = history["Close"]

    # ========================================
    # Moving Averages
    # ========================================

    sma_20 = ta.trend.SMAIndicator(
        close=close,
        window=20
    ).sma_indicator()

    sma_50 = ta.trend.SMAIndicator(
        close=close,
        window=50
    ).sma_indicator()

    sma_200 = ta.trend.SMAIndicator(
        close=close,
        window=200
    ).sma_indicator()

    ema_20 = ta.trend.EMAIndicator(
        close=close,
        window=20
    ).ema_indicator()

    ema_50 = ta.trend.EMAIndicator(
        close=close,
        window=50
    ).ema_indicator()


    # ========================================
    # RSI
    # ========================================

    rsi = ta.momentum.RSIIndicator(
        close=close,
        window=14
    ).rsi()


    # ========================================
    # MACD
    # ========================================

    macd_indicator = ta.trend.MACD(
        close=close,
        window_slow=26,
        window_fast=12,
        window_sign=9
    )

    macd = macd_indicator.macd()
    macd_signal = macd_indicator.macd_signal()
    macd_histogram = macd_indicator.macd_diff()


    # ========================================
    # Current Values
    # ========================================

    current_price = float(close.iloc[-1])

    latest_sma_20 = float(sma_20.iloc[-1])
    latest_sma_50 = float(sma_50.iloc[-1])
    latest_sma_200 = float(sma_200.iloc[-1])

    latest_ema_20 = float(ema_20.iloc[-1])
    latest_ema_50 = float(ema_50.iloc[-1])

    latest_rsi = float(rsi.iloc[-1])

    latest_macd = float(macd.iloc[-1])
    latest_macd_signal = float(macd_signal.iloc[-1])
    latest_macd_histogram = float(macd_histogram.iloc[-1])


    # ========================================
    # RSI Signal
    # ========================================

    if latest_rsi >= 70:
        rsi_signal = "Overbought"

    elif latest_rsi <= 30:
        rsi_signal = "Oversold"

    else:
        rsi_signal = "Neutral"


    # ========================================
    # MACD Signal
    # ========================================

    if latest_macd > latest_macd_signal:
        macd_signal_text = "Bullish"

    elif latest_macd < latest_macd_signal:
        macd_signal_text = "Bearish"

    else:
        macd_signal_text = "Neutral"


    # ========================================
    # Moving Average Signals
    # ========================================

    sma_20_signal = (
        "Bullish"
        if current_price > latest_sma_20
        else "Bearish"
    )

    sma_50_signal = (
        "Bullish"
        if current_price > latest_sma_50
        else "Bearish"
    )

    sma_200_signal = (
        "Bullish"
        if current_price > latest_sma_200
        else "Bearish"
    )


    # ========================================
    # Support & Resistance
    # ========================================

    recent_data = history.tail(60)

    support = float(
        recent_data["Low"].min()
    )

    resistance = float(
        recent_data["High"].max()
    )


    # ========================================
    # Overall Technical Score
    # ========================================

    score = 0


    if current_price > latest_sma_20:
        score += 1
    else:
        score -= 1


    if current_price > latest_sma_50:
        score += 1
    else:
        score -= 1


    if current_price > latest_sma_200:
        score += 1
    else:
        score -= 1


    if latest_macd > latest_macd_signal:
        score += 1
    else:
        score -= 1


    if 50 <= latest_rsi < 70:
        score += 1

    elif latest_rsi < 30:
        score += 1

    elif latest_rsi > 70:
        score -= 1


    if score >= 3:
        overall_signal = "Bullish"

    elif score <= -3:
        overall_signal = "Bearish"

    else:
        overall_signal = "Neutral"


    # ========================================
    # Return Result
    # ========================================

    return {

        "status": "success",

        "symbol": symbol.upper(),

        "current_price": round(
            current_price,
            2
        ),

        "moving_averages": {

            "sma_20": round(
                latest_sma_20,
                2
            ),

            "sma_50": round(
                latest_sma_50,
                2
            ),

            "sma_200": round(
                latest_sma_200,
                2
            ),

            "ema_20": round(
                latest_ema_20,
                2
            ),

            "ema_50": round(
                latest_ema_50,
                2
            ),

            "sma_20_signal": sma_20_signal,

            "sma_50_signal": sma_50_signal,

            "sma_200_signal": sma_200_signal

        },

        "rsi": {

            "value": round(
                latest_rsi,
                2
            ),

            "signal": rsi_signal

        },

        "macd": {

            "macd": round(
                latest_macd,
                2
            ),

            "signal": round(
                latest_macd_signal,
                2
            ),

            "histogram": round(
                latest_macd_histogram,
                2
            ),

            "trend": macd_signal_text

        },

        "levels": {

            "support": round(
                support,
                2
            ),

            "resistance": round(
                resistance,
                2
            )

        },

        "overall_signal": overall_signal,

        "technical_score": score

    }