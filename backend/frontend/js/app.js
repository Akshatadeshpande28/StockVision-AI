const API = "https://literate-journey-q7p44vgvg567h67vq-8000.app.github.dev";


async function analyzeStock() {

    const symbolInput = document.getElementById("symbol");
    const result = document.getElementById("result");

    const symbol = symbolInput.value.trim().toUpperCase();

    if (!symbol) {
        result.innerHTML = `
            <div class="alert alert-warning">
                Please enter a stock symbol.
            </div>
        `;
        return;
    }

    result.innerHTML = `
        <div class="alert alert-info">
            Loading ${symbol}...
        </div>
    `;

    try {

        console.log("Request URL:", `${API}/analysis/${symbol}`);

        const response = await fetch(
            `${API}/analysis/${encodeURIComponent(symbol)}`
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
            throw new Error(`Server returned HTTP ${response.status}`);
        }

        const data = await response.json();

        console.log("Analysis data:", data);

        if (data.status === "error") {
            throw new Error(data.message);
        }

        displayAnalysis(data);

    } catch (error) {

        console.error("Analysis error:", error);

        result.innerHTML = `
            <div class="alert alert-danger">
                <strong>Failed to fetch data ❌</strong>
                <br><br>
                ${error.message}
            </div>
        `;
    }
}


function displayAnalysis(data) {

    const analysis = data.analysis;

    let html = `
        <div class="card shadow-sm mt-4">
            <div class="card-body">

                <h3>${data.symbol} Analysis</h3>

                <div class="row mt-3">
    `;

    for (const [period, values] of Object.entries(analysis)) {

        html += `
            <div class="col-md-6 mb-3">

                <div class="border rounded p-3">

                    <h5>${formatPeriod(period)}</h5>

                    <p>
                        <strong>Current Price:</strong>
                        ₹${values.current_price}
                    </p>

                    <p>
                        <strong>Change:</strong>
                        ${values.percentage_change}%
                    </p>

                    <p>
                        <strong>Trend:</strong>
                        ${values.trend}
                    </p>

                </div>

            </div>
        `;
    }

    html += `
                </div>

            </div>
        </div>
    `;

    document.getElementById("result").innerHTML = html;
}


function formatPeriod(period) {

    const names = {
        "1_month": "1 Month",
        "3_months": "3 Months",
        "6_months": "6 Months",
        "1_year": "1 Year"
    };

    return names[period] || period;
}
