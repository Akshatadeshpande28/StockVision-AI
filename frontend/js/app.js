// ========================================
// StockVision AI - Frontend JavaScript
// ========================================

// Backend API
const API = "https://literate-journey-q7p44vgvg567h67vq-8000.app.github.dev";


// ========================================
// Analyze Stock
// ========================================

async function analyzeStock() {

    const symbolInput = document.getElementById("symbolInput");
    const symbol = symbolInput.value.trim().toUpperCase();

    const loading = document.getElementById("loading");
    const results = document.getElementById("results");
    const error = document.getElementById("error");
    const button = document.getElementById("analyzeButton");

    // Check input
    if (!symbol) {

        error.textContent = "Please enter a stock symbol.";

        error.classList.remove("d-none");
        results.classList.add("d-none");

        return;
    }


    // Reset screen
    error.classList.add("d-none");
    results.classList.add("d-none");

    loading.classList.remove("d-none");

    button.disabled = true;


    try {

        console.log("Analyzing stock:", symbol);


        // ========================================
        // Get Stock Information
        // ========================================

        const stockResponse =
            await fetch(
                `${API}/stock/${encodeURIComponent(symbol)}`
            );


        if (!stockResponse.ok) {

            throw new Error(
                `Stock API error: HTTP ${stockResponse.status}`
            );

        }


        const stockData =
            await stockResponse.json();


        console.log("Stock data:", stockData);


        if (stockData.status !== "success") {

            throw new Error(
                stockData.message ||
                "Unable to fetch stock data."
            );

        }


        // ========================================
        // Get Multi-Period Analysis
        // ========================================

        const analysisResponse =
            await fetch(
                `${API}/analysis/${encodeURIComponent(symbol)}`
            );


        if (!analysisResponse.ok) {

            throw new Error(
                `Analysis API error: HTTP ${analysisResponse.status}`
            );

        }


        const analysisData =
            await analysisResponse.json();


        console.log(
            "Analysis data:",
            analysisData
        );


        if (analysisData.status !== "success") {

            throw new Error(
                analysisData.message ||
                "Unable to fetch analysis."
            );

        }


        // ========================================
        // Display Main Stock Information
        // ========================================

        document.getElementById(
            "stockSymbol"
        ).textContent = stockData.symbol;


        document.getElementById(
            "currentPrice"
        ).textContent =
            `₹${stockData.current_price.toFixed(2)}`;


        document.getElementById(
            "overallChange"
        ).textContent =
            `${stockData.percentage_change >= 0 ? "+" : ""}${stockData.percentage_change.toFixed(2)}%`;


        setTrend(
            document.getElementById("overallTrend"),
            stockData.trend
        );


        // ========================================
        // Display Period Analysis
        // ========================================

        const analysis =
            analysisData.analysis;


        updatePeriod(
            "change1m",
            "trend1m",
            analysis["1_month"]
        );


        updatePeriod(
            "change3m",
            "trend3m",
            analysis["3_months"]
        );


        updatePeriod(
            "change6m",
            "trend6m",
            analysis["6_months"]
        );


        updatePeriod(
            "change1y",
            "trend1y",
            analysis["1_year"]
        );


        // ========================================
// Show Results
// ========================================

results.classList.remove("d-none");

// Hide the main loading spinner
loading.classList.add("d-none");

// Load candlestick chart separately
loadChart(symbol, "6mo");

    }


    catch (err) {

        console.error(
            "Stock analysis error:",
            err
        );


        error.textContent =
            `Unable to analyze ${symbol}: ${err.message}`;


        error.classList.remove("d-none");

    }


    finally {

    loading.classList.add("d-none");

    button.disabled = false;

    }
}



// ========================================
// Update Performance Card
// ========================================

function updatePeriod(
    changeId,
    trendId,
    data
) {

    if (!data) {

        document.getElementById(
            changeId
        ).textContent = "--";


        document.getElementById(
            trendId
        ).textContent = "No Data";


        return;
    }


    const change =
        data.percentage_change;


    document.getElementById(
        changeId
    ).textContent =
        `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;


    setTrend(
        document.getElementById(trendId),
        data.trend
    );

}



// ========================================
// Set Trend Badge
// ========================================

function setTrend(
    element,
    trend
) {

    element.textContent = trend;


    element.classList.remove(
        "bg-success",
        "bg-danger",
        "bg-warning",
        "text-dark"
    );


    if (trend === "Bullish") {

        element.classList.add(
            "bg-success"
        );

    }

    else if (trend === "Bearish") {

        element.classList.add(
            "bg-danger"
        );

    }

    else {

        element.classList.add(
            "bg-warning",
            "text-dark"
        );

    }

}



// ========================================
// Load Candlestick Chart
// ========================================

async function loadChart(
    symbol,
    period = "6mo"
) {

    const chart =
        document.getElementById(
            "stockChart"
        );


    if (!chart) {

        console.error(
            "Chart container not found."
        );

        return;

    }


    // Loading message

    chart.innerHTML = `
        <div class="text-center mt-5">

            <div
                class="spinner-border"
                role="status">
            </div>

            <p class="mt-2">
                Loading chart...
            </p>

        </div>
    `;


    try {

        console.log(
            `Loading chart for ${symbol} (${period})`
        );


        // ========================================
        // Request Chart Data
        // ========================================

        const response =
            await fetch(
                `${API}/chart/${encodeURIComponent(symbol)}?period=${encodeURIComponent(period)}`
            );


        if (!response.ok) {

            throw new Error(
                `Chart API error: HTTP ${response.status}`
            );

        }


        const result =
            await response.json();


        console.log(
            "Chart data:",
            result
        );


        if (result.status !== "success") {

            throw new Error(
                result.message ||
                "Unable to load chart."
            );

        }


        const data =
            result.data;


        if (!data || data.length === 0) {

            throw new Error(
                "No chart data available."
            );

        }


        // ========================================
        // Prepare Chart Data
        // ========================================

        const dates =
            data.map(
                item => item.date
            );


        const open =
            data.map(
                item => item.open
            );


        const high =
            data.map(
                item => item.high
            );


        const low =
            data.map(
                item => item.low
            );


        const close =
            data.map(
                item => item.close
            );


        // ========================================
        // Candlestick Trace
        // ========================================

        const candlestick = {

            x: dates,

            open: open,

            high: high,

            low: low,

            close: close,

            type: "candlestick",

            name: symbol,

            increasing: {
                line: {
                    color: "#22c55e"
                }
            },

            decreasing: {
                line: {
                    color: "#ef4444"
                }
            }

        };


        // ========================================
        // Chart Layout
        // ========================================

        const layout = {

            title: {
                text: `${symbol} - ${period} Price Chart`,
                font: {
                    color: "#f8fafc"
                }
            },

            paper_bgcolor: "#111827",

            plot_bgcolor: "#111827",

            font: {
                color: "#f8fafc"
            },

            xaxis: {

                title: "Date",

                rangeslider: {
                    visible: false
                },

                gridcolor: "#1f2937",

                zerolinecolor: "#1f2937"

            },

            yaxis: {

                title: "Price (₹)",

                gridcolor: "#1f2937",

                zerolinecolor: "#1f2937"

            },

            margin: {

                l: 65,

                r: 30,

                t: 70,

                b: 55

            },

            hovermode: "x unified"

        };


        // ========================================
        // Plotly Configuration
        // ========================================

        const config = {

            responsive: true,

            displaylogo: false,

            modeBarButtonsToRemove: [
                "lasso2d",
                "select2d"
            ]

        };


        // ========================================
        // Render Chart
        // ========================================

        await Plotly.newPlot(
            "stockChart",
            [candlestick],
            layout,
            config
        );


        console.log(
            "Chart loaded successfully."
        );

    }


    catch (error) {

        console.error(
            "Chart error:",
            error
        );


        chart.innerHTML = `
            <div class="alert alert-danger">
                Unable to load chart:
                ${error.message}
            </div>
        `;

    }

}



// ========================================
// Chart Period Selector
// ========================================

const chartPeriod =
    document.getElementById(
        "chartPeriod"
    );


if (chartPeriod) {

    chartPeriod.addEventListener(
        "change",
        async function () {

            const symbol =
                document
                    .getElementById(
                        "symbolInput"
                    )
                    .value
                    .trim()
                    .toUpperCase();


            const period =
                this.value;


            if (symbol) {

                await loadChart(
                    symbol,
                    period
                );

            }

        }
    );

}



// ========================================
// Enter Key Support
// ========================================

const symbolInput =
    document.getElementById(
        "symbolInput"
    );


if (symbolInput) {

    symbolInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                analyzeStock();

            }

        }
    );

}



// ========================================
// Console Startup Message
// ========================================

console.log(
    "StockVision AI frontend loaded successfully 🚀"
);

console.log(
    "Backend API:",
    API
);