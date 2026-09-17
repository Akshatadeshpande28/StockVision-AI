// ========================================
// StockVision AI - Frontend JavaScript
// ========================================

const API =
    "https://literate-journey-q7p44vgvg567h67vq-8000.app.github.dev";

// ========================================
// Analyze Stock
// ========================================

async function analyzeStock() {

    const symbolInput =
        document.getElementById("symbolInput");

    const symbol =
        symbolInput.value.trim().toUpperCase();


    const loading =
        document.getElementById("loading");

    const results =
        document.getElementById("results");

    const error =
        document.getElementById("error");

    const button =
        document.getElementById("analyzeButton");


    // Validate input

    if (!symbol) {

        error.textContent =
            "Please enter a stock symbol.";

        error.classList.remove("d-none");

        results.classList.add("d-none");

        return;
    }


    // Reset

    error.classList.add("d-none");

    results.classList.add("d-none");

    loading.classList.remove("d-none");

    button.disabled = true;


    try {

        console.log(
            "Analyzing stock:",
            symbol
        );


        // ====================================
        // STOCK DATA
        // ====================================

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


        console.log(
            "Stock data:",
            stockData
        );


        if (stockData.status !== "success") {

            throw new Error(
                stockData.message ||
                "Unable to fetch stock data."
            );

        }


        // ====================================
        // MULTI PERIOD ANALYSIS
        // ====================================

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


        if (analysisData.status !== "success") {

            throw new Error(
                analysisData.message ||
                "Unable to fetch analysis."
            );

        }


        // ====================================
        // TECHNICAL ANALYSIS
        // ====================================

        const technicalResponse =
            await fetch(
                `${API}/technical/${encodeURIComponent(symbol)}`
            );


        if (!technicalResponse.ok) {

            throw new Error(
                `Technical API error: HTTP ${technicalResponse.status}`
            );

        }


        const technicalData =
            await technicalResponse.json();


        console.log(
            "Technical data:",
            technicalData
        );


        if (technicalData.status !== "success") {

            throw new Error(
                technicalData.message ||
                "Unable to fetch technical analysis."
            );

        }


        // ====================================
        // MAIN STOCK INFORMATION
        // ====================================

        document.getElementById(
            "stockSymbol"
        ).textContent =
            stockData.symbol;


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


        // ====================================
        // PERFORMANCE
        // ====================================

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


        // ====================================
        // TECHNICAL ANALYSIS
        // ====================================

        displayTechnicalAnalysis(
            technicalData
        );


        // ====================================
        // SHOW RESULTS
        // ====================================

        results.classList.remove("d-none");

        loading.classList.add("d-none");


        // ====================================
        // LOAD CHART
        // ====================================

        loadChart(
            symbol,
            "6mo"
        );


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
// Display Technical Analysis
// ========================================

function displayTechnicalAnalysis(
    data
) {

    // ====================================
    // Overall Signal
    // ====================================

    setTrend(
        document.getElementById(
            "technicalSignal"
        ),
        data.overall_signal
    );


    document.getElementById(
        "technicalScore"
    ).textContent =
        data.technical_score;


    // ====================================
    // Moving Averages
    // ====================================

    const ma =
        data.moving_averages;


    document.getElementById(
        "sma20"
    ).textContent =
        `₹${ma.sma_20.toFixed(2)}`;


    document.getElementById(
        "sma50"
    ).textContent =
        `₹${ma.sma_50.toFixed(2)}`;


    document.getElementById(
        "sma200"
    ).textContent =
        `₹${ma.sma_200.toFixed(2)}`;


    document.getElementById(
        "ema20"
    ).textContent =
        `₹${ma.ema_20.toFixed(2)}`;


    document.getElementById(
        "ema50"
    ).textContent =
        `₹${ma.ema_50.toFixed(2)}`;


    setTrend(
        document.getElementById(
            "sma20Signal"
        ),
        ma.sma_20_signal
    );


    setTrend(
        document.getElementById(
            "sma50Signal"
        ),
        ma.sma_50_signal
    );


    setTrend(
        document.getElementById(
            "sma200Signal"
        ),
        ma.sma_200_signal
    );


    // ====================================
    // RSI
    // ====================================

    const rsi =
        data.rsi;


    document.getElementById(
        "rsiValue"
    ).textContent =
        rsi.value.toFixed(2);


    setRSISignal(
        document.getElementById(
            "rsiSignal"
        ),
        rsi.signal
    );


    const rsiProgress =
        document.getElementById(
            "rsiProgress"
        );


    const rsiWidth =
        Math.max(
            0,
            Math.min(
                100,
                rsi.value
            )
        );


    rsiProgress.style.width =
        `${rsiWidth}%`;


    // ====================================
    // MACD
    // ====================================

    const macd =
        data.macd;


    document.getElementById(
        "macdValue"
    ).textContent =
        macd.macd.toFixed(2);


    document.getElementById(
        "macdSignalValue"
    ).textContent =
        macd.signal.toFixed(2);


    document.getElementById(
        "macdHistogram"
    ).textContent =
        macd.histogram.toFixed(2);


    setTrend(
        document.getElementById(
            "macdTrend"
        ),
        macd.trend
    );


    // ====================================
    // Support / Resistance
    // ====================================

    const levels =
        data.levels;


    document.getElementById(
        "supportLevel"
    ).textContent =
        `₹${levels.support.toFixed(2)}`;


    document.getElementById(
        "resistanceLevel"
    ).textContent =
        `₹${levels.resistance.toFixed(2)}`;

}



// ========================================
// RSI Signal Badge
// ========================================

function setRSISignal(
    element,
    signal
) {

    element.textContent =
        signal;


    element.classList.remove(
        "bg-success",
        "bg-danger",
        "bg-warning",
        "text-dark"
    );


    if (signal === "Overbought") {

        element.classList.add(
            "bg-danger"
        );

    }

    else if (signal === "Oversold") {

        element.classList.add(
            "bg-success"
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
        ).textContent =
            "--";


        document.getElementById(
            trendId
        ).textContent =
            "No Data";


        return;

    }


    const change =
        data.percentage_change;


    document.getElementById(
        changeId
    ).textContent =
        `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;


    setTrend(
        document.getElementById(
            trendId
        ),
        data.trend
    );

}



// ========================================
// Trend Badge
// ========================================

function setTrend(
    element,
    trend
) {

    element.textContent =
        trend;


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
// Candlestick Chart
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


        if (result.status !== "success") {

            throw new Error(
                result.message ||
                "Unable to load chart."
            );

        }


        const data =
            result.data;


        if (
            !data ||
            data.length === 0
        ) {

            throw new Error(
                "No chart data available."
            );

        }


        // Clear loading spinner

        chart.innerHTML = "";


        // ====================================
        // Chart Data
        // ====================================

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


        // ====================================
        // Candlestick
        // ====================================

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


        // ====================================
        // Chart Layout
        // ====================================

        const periodNames = {

            "1mo": "1 Month",

            "3mo": "3 Months",

            "6mo": "6 Months",

            "1y": "1 Year"

        };


        const layout = {

            title: {

                text:
                    `${symbol} - ${periodNames[period]} Price Chart`,

                font: {
                    color: "#f8fafc"
                }

            },

            paper_bgcolor:
                "#111827",

            plot_bgcolor:
                "#111827",

            font: {

                color:
                    "#f8fafc"

            },

            xaxis: {

                title:
                    "Date",

                rangeslider: {

                    visible:
                        false

                },

                gridcolor:
                    "#1f2937",

                zerolinecolor:
                    "#1f2937"

            },

            yaxis: {

                title:
                    "Price (₹)",

                gridcolor:
                    "#1f2937",

                zerolinecolor:
                    "#1f2937"

            },

            margin: {

                l: 65,

                r: 30,

                t: 70,

                b: 55

            },

            hovermode:
                "x unified"

        };


        const config = {

            responsive:
                true,

            displaylogo:
                false,

            modeBarButtonsToRemove: [

                "lasso2d",

                "select2d"

            ]

        };


        await Plotly.newPlot(

            "stockChart",

            [candlestick],

            layout,

            config

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
// Enter Key
// ========================================

const symbolInput =
    document.getElementById(
        "symbolInput"
    );


if (symbolInput) {

    symbolInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                analyzeStock();

            }

        }
    );

}



// ========================================
// Startup
// ========================================

console.log(
    "StockVision AI frontend loaded successfully 🚀"
);

console.log(
    "Backend API:",
    API
);