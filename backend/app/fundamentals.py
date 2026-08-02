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