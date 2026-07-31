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

def get_fundamental_analysis(symbol: str):
    """
    Fetch fundamental company data and cash-flow metrics.
    """
    try:
        stock = yf.Ticker(symbol)

        info = stock.info
        cashflow = stock.cashflow

        def safe_value(key):
            value = info.get(key)

            if value is None:
                return None

            if isinstance(value, (int, float)):
                return round(value, 2)

            return value

        fundamental_data = {
            "symbol": symbol.upper(),
            "company_name": safe_value("longName"),
            "sector": safe_value("sector"),
            "industry": safe_value("industry"),

            "market_cap": safe_value("marketCap"),
            "enterprise_value": safe_value("enterpriseValue"),

            "trailing_pe": safe_value("trailingPE"),
            "forward_pe": safe_value("forwardPE"),
            "price_to_book": safe_value("priceToBook"),

            "revenue": safe_value("totalRevenue"),
            "revenue_growth": safe_value("revenueGrowth"),

            "profit_margin": safe_value("profitMargins"),
            "operating_margin": safe_value("operatingMargins"),

            "return_on_equity": safe_value("returnOnEquity"),
            "return_on_assets": safe_value("returnOnAssets"),

            "total_cash": safe_value("totalCash"),
            "total_debt": safe_value("totalDebt"),
            "debt_to_equity": safe_value("debtToEquity"),

            "free_cash_flow": safe_value("freeCashflow"),
            "operating_cash_flow": safe_value("operatingCashflow"),

            "dividend_yield": safe_value("dividendYield"),
            "beta": safe_value("beta"),

            "52_week_high": safe_value("fiftyTwoWeekHigh"),
            "52_week_low": safe_value("fiftyTwoWeekLow"),
            "current_price": safe_value("currentPrice"),
        }

        return {
            "status": "success",
            "fundamental_analysis": fundamental_data
        }

    except Exception as e:
        return {
            "status": "error",
            "symbol": symbol,
            "message": str(e)
        }