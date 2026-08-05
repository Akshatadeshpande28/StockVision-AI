const API = "https://special-halibut-4jwvvq9q9pqv25rg5-8000.app.github.dev"


/* ================================
   Analyze Stock
================================ */

async function analyzeStock() {

    const symbol = document.getElementById("symbol").value.trim().toUpperCase();

    if (!symbol) {
        alert("Please enter a stock symbol.");
        return;
    }

    document.getElementById("summary").innerHTML = `
        <div class="text-center mt-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-3">Loading Stock Data...</p>
        </div>
    `;

    document.getElementById("technical").innerHTML = "";
    document.getElementById("fundamental").innerHTML = "";
    document.getElementById("chart").innerHTML = "";

    try {

        const analysisResponse = await fetch(`${API}/analysis/${symbol}`);
        const technicalResponse = await fetch(`${API}/technical/${symbol}`);
        const fundamentalResponse = await fetch(`${API}/fundamentals/${symbol}`);
        const chartResponse = await fetch(`${API}/chart/${symbol}`);

        if (
            !analysisResponse.ok ||
            !technicalResponse.ok ||
            !fundamentalResponse.ok ||
            !chartResponse.ok
        ) {
            throw new Error("Failed to fetch stock data.");
        }

        const analysis = await analysisResponse.json();
        const technical = await technicalResponse.json();
        const fundamental = await fundamentalResponse.json();
        const chart = await chartResponse.json();

        displaySummary(analysis);
        displayTechnical(technical);
        displayFundamental(fundamental);
        displayChart(chart);

    }
    catch (error) {

        console.error(error);

        document.getElementById("summary").innerHTML = `
            <div class="alert alert-danger">
                ${error.message}
            </div>
        `;

    }

}

/* ================================
   Format Numbers
================================ */

function formatNumber(value){

    if(value===null || value===undefined)
        return "-";

    return Number(value).toLocaleString("en-IN");

}

/* ================================
   Summary Cards
================================ */

function displaySummary(data){

    const summary = data.analysis["3_months"];

    document.getElementById("summary").innerHTML = `

    <div class="col-md-3">

        <div class="card metric-card">

            <div class="metric-title">
                Stock
            </div>

            <div class="metric-value">
                ${data.symbol}
            </div>

        </div>

    </div>

    <div class="col-md-3">

        <div class="card metric-card">

            <div class="metric-title">
                Current Price
            </div>

            <div class="metric-value">
                ₹${summary.current_price}
            </div>

        </div>

    </div>

    <div class="col-md-3">

        <div class="card metric-card">

            <div class="metric-title">
                Trend
            </div>

            <div class="metric-value">
                ${summary.trend}
            </div>

        </div>

    </div>

    <div class="col-md-3">

        <div class="card metric-card">

            <div class="metric-title">
                Change
            </div>

            <div class="metric-value">
                ${summary.percentage_change}%
            </div>

        </div>

    </div>

    `;

}
/* ================================
   Technical Analysis
================================ */

function displayTechnical(data){

    const t = data.technical_analysis;

    document.getElementById("technical").innerHTML = `

    <div class="card section-card">

        <h4 class="section-title">
            📊 Technical Analysis
        </h4>

        <table class="table table-bordered">

            <tr>
                <th>Current Price</th>
                <td>₹${t.current_price}</td>
            </tr>

            <tr>
                <th>RSI (14)</th>
                <td>${t.rsi_14}</td>
            </tr>

            <tr>
                <th>RSI Signal</th>
                <td>${t.rsi_signal}</td>
            </tr>

            <tr>
                <th>MACD</th>
                <td>${t.macd}</td>
            </tr>

            <tr>
                <th>MACD Signal</th>
                <td>${t.macd_signal}</td>
            </tr>

            <tr>
                <th>SMA 20</th>
                <td>${t.sma_20}</td>
            </tr>

            <tr>
                <th>SMA 50</th>
                <td>${t.sma_50}</td>
            </tr>

            <tr>
                <th>SMA 200</th>
                <td>${t.sma_200}</td>
            </tr>

            <tr>
                <th>EMA 20</th>
                <td>${t.ema_20}</td>
            </tr>

            <tr>
                <th>EMA 50</th>
                <td>${t.ema_50}</td>
            </tr>

            <tr>
                <th>52 Week High</th>
                <td>${t["52_week_high"]}</td>
            </tr>

            <tr>
                <th>52 Week Low</th>
                <td>${t["52_week_low"]}</td>
            </tr>

            <tr>
                <th>Current Volume</th>
                <td>${formatNumber(t.current_volume)}</td>
            </tr>

            <tr>
                <th>Avg Volume (20)</th>
                <td>${formatNumber(t.average_volume_20)}</td>
            </tr>

            <tr>
                <th>Volume Signal</th>
                <td>${t.volume_signal}</td>
            </tr>

            <tr>
                <th>Volatility</th>
                <td>${t.volatility_percent}%</td>
            </tr>

            <tr>
                <th>Bullish Points</th>
                <td>${t.bullish_points}</td>
            </tr>

            <tr>
                <th>Bearish Points</th>
                <td>${t.bearish_points}</td>
            </tr>

            <tr>

                <th>Overall Signal</th>

                <td class="${
                    t.technical_signal === "Bullish"
                    ? "buy"
                    : t.technical_signal === "Bearish"
                    ? "sell"
                    : "neutral"
                }">

                    ${t.technical_signal}

                </td>

            </tr>

        </table>

    </div>

    `;

}
/* ================================
   Fundamental Analysis
================================ */

function displayFundamental(data){

    const f = data.fundamental_analysis;

    document.getElementById("fundamental").innerHTML = `

    <div class="card section-card">

        <h4 class="section-title">
            🏢 Fundamental Analysis
        </h4>

        <table class="table table-bordered">

            <tr>
                <th>Company</th>
                <td>${f.company_name}</td>
            </tr>

            <tr>
                <th>Sector</th>
                <td>${f.sector}</td>
            </tr>

            <tr>
                <th>Industry</th>
                <td>${f.industry}</td>
            </tr>

            <tr>
                <th>Current Price</th>
                <td>₹${f.current_price}</td>
            </tr>

            <tr>
                <th>Market Cap</th>
                <td>${formatNumber(f.market_cap)}</td>
            </tr>

            <tr>
                <th>Enterprise Value</th>
                <td>${formatNumber(f.enterprise_value)}</td>
            </tr>

            <tr>
                <th>Trailing PE</th>
                <td>${f.trailing_pe ?? "-"}</td>
            </tr>

            <tr>
                <th>Forward PE</th>
                <td>${f.forward_pe ?? "-"}</td>
            </tr>

            <tr>
                <th>Price to Book</th>
                <td>${f.price_to_book ?? "-"}</td>
            </tr>

            <tr>
                <th>Revenue</th>
                <td>${formatNumber(f.revenue)}</td>
            </tr>

            <tr>
                <th>Revenue Growth</th>
                <td>${f.revenue_growth ?? "-"}%</td>
            </tr>

            <tr>
                <th>Profit Margin</th>
                <td>${f.profit_margin ?? "-"}</td>
            </tr>

            <tr>
                <th>Operating Margin</th>
                <td>${f.operating_margin ?? "-"}</td>
            </tr>

            <tr>
                <th>Debt to Equity</th>
                <td>${f.debt_to_equity ?? "-"}</td>
            </tr>

            <tr>
                <th>Dividend Yield</th>
                <td>${f.dividend_yield ?? "-"}%</td>
            </tr>

            <tr>
                <th>Beta</th>
                <td>${f.beta ?? "-"}</td>
            </tr>

            <tr>
                <th>52 Week High</th>
                <td>${f["52_week_high"]}</td>
            </tr>

            <tr>
                <th>52 Week Low</th>
                <td>${f["52_week_low"]}</td>
            </tr>

        </table>

    </div>

    `;

}
/* ================================
   Candlestick Chart
================================ */

function displayChart(chart) {

    try {

        // chart is returned as a JSON string
        const figure = JSON.parse(chart);

        Plotly.newPlot(
            "chart",
            figure.data,
            figure.layout,
            {
                responsive: true,
                displayModeBar: false
            }
        );

    } catch (error) {

        console.error(error);

        document.getElementById("chart").innerHTML = `
            <div class="alert alert-danger">
                Failed to load chart.
            </div>
        `;
    }

}