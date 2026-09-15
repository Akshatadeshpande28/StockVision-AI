const API = "https://literate-journey-q7p44vgvg567h67vq-8000.app.github.dev";


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

        console.log("Analyzing:", symbol);

        // Get current stock information
        const stockResponse =
            await fetch(`${API}/stock/${encodeURIComponent(symbol)}`);

        if (!stockResponse.ok) {
            throw new Error(`Stock API error: HTTP ${stockResponse.status}`);
        }

        const stockData = await stockResponse.json();

        console.log("Stock data:", stockData);


        if (stockData.status !== "success") {
            throw new Error(stockData.message || "Unable to fetch stock data.");
        }


        // Get multi-period analysis
        const analysisResponse =
            await fetch(`${API}/analysis/${encodeURIComponent(symbol)}`);

        if (!analysisResponse.ok) {
            throw new Error(
                `Analysis API error: HTTP ${analysisResponse.status}`
            );
        }

        const analysisData = await analysisResponse.json();

        console.log("Analysis data:", analysisData);


        if (analysisData.status !== "success") {
            throw new Error(
                analysisData.message || "Unable to fetch analysis."
            );
        }


        // Display main stock information
        document.getElementById("stockSymbol").textContent =
            stockData.symbol;

        document.getElementById("currentPrice").textContent =
            `₹${stockData.current_price.toFixed(2)}`;

        document.getElementById("overallChange").textContent =
            `${stockData.percentage_change >= 0 ? "+" : ""}${stockData.percentage_change.toFixed(2)}%`;

        setTrend(
            document.getElementById("overallTrend"),
            stockData.trend
        );


        // Display period analysis
        const analysis = analysisData.analysis;

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


        // Show results
        results.classList.remove("d-none");

    } catch (err) {

        console.error("Stock analysis error:", err);

        error.textContent =
            `Unable to analyze ${symbol}: ${err.message}`;

        error.classList.remove("d-none");

    } finally {

        loading.classList.add("d-none");
        button.disabled = false;
    }
}


/* Update a performance card */

function updatePeriod(changeId, trendId, data) {

    if (!data) {
        document.getElementById(changeId).textContent = "--";
        document.getElementById(trendId).textContent = "No Data";
        return;
    }

    const change = data.percentage_change;

    document.getElementById(changeId).textContent =
        `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

    setTrend(
        document.getElementById(trendId),
        data.trend
    );
}


/* Set trend badge */

function setTrend(element, trend) {

    element.textContent = trend;

    element.classList.remove(
        "bg-success",
        "bg-danger",
        "bg-warning",
        "text-dark"
    );

    if (trend === "Bullish") {

        element.classList.add("bg-success");

    } else if (trend === "Bearish") {

        element.classList.add("bg-danger");

    } else {

        element.classList.add(
            "bg-warning",
            "text-dark"
        );
    }
}


/* Press Enter to analyze */

document
    .getElementById("symbolInput")
    .addEventListener("keydown", function(event) {

        if (event.key === "Enter") {
            analyzeStock();
        }

    });