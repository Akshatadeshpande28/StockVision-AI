const API = "https://special-halibut-4jwvvq9q9pqv25rg5-8000.app.github.dev"


async function analyzeStock() {

    const symbol = document.getElementById("symbol").value.trim();

    if (!symbol) {
        alert("Please enter a stock symbol.");
        return;
    }

    document.getElementById("summary").innerHTML = `
    <div class="text-center mt-4">
        <div class="spinner-border text-primary"></div>
        <p class="mt-2">Loading Stock Data...</p>
    </div>`;

    document.getElementById("technical").innerHTML = "";
    document.getElementById("fundamental").innerHTML = "";
    document.getElementById("chart").innerHTML = "";

    try {

        const [summaryRes, technicalRes, fundamentalRes, chartRes] =
            await Promise.all([
                fetch(`${API}/analysis/${symbol}`),
                fetch(`${API}/technical/${symbol}`),
                fetch(`${API}/fundamentals/${symbol}`),
                fetch(`${API}/chart/${symbol}`)
            ]);

        const summary = await summaryRes.json();
        const technical = await technicalRes.json();
        const fundamental = await fundamentalRes.json();
        const chart = await chartRes.json();

        displaySummary(summary);
        displayTechnical(technical);
        displayFundamental(fundamental);
        displayChart(chart);

    } catch (err) {

        console.error(err);

        document.getElementById("summary").innerHTML = `
        <div class="alert alert-danger">
            Unable to connect to backend.
        </div>`;
    }
}

function displaySummary(data) {

    const summary = data.analysis["3_months"];

    document.getElementById("summary").innerHTML = `

    <div class="col-md-3">
        <div class="card shadow text-center p-3">
            <h6>Stock</h6>
            <h4>${data.symbol}</h4>
        </div>
    </div>

    <div class="col-md-3">
        <div class="card shadow text-center p-3">
            <h6>Current Price</h6>
            <h4>₹${summary.current_price}</h4>
        </div>
    </div>

    <div class="col-md-3">
        <div class="card shadow text-center p-3">
            <h6>Trend</h6>
            <h4>${summary.trend}</h4>
        </div>
    </div>

    <div class="col-md-3">
        <div class="card shadow text-center p-3">
            <h6>Price Change</h6>
            <h4>${summary.percentage_change}%</h4>
        </div>
    </div>
    `;
}

function displayTechnical(data) {

    const t = data.technical_analysis || data;

    document.getElementById("technical").innerHTML = `
    <div class="card shadow p-3">

        <h4>Technical Analysis</h4>

        <table class="table table-sm">

            <tr>
                <th>Current Price</th>
                <td>${t.current_price ?? "-"}</td>
            </tr>

            <tr>
                <th>RSI</th>
                <td>${t.rsi_14 ?? "-"}</td>
            </tr>

            <tr>
                <th>MACD</th>
                <td>${t.macd ?? "-"}</td>
            </tr>

            <tr>
                <th>SMA 20</th>
                <td>${t.sma_20 ?? "-"}</td>
            </tr>

            <tr>
                <th>SMA 50</th>
                <td>${t.sma_50 ?? "-"}</td>
            </tr>

            <tr>
                <th>Signal</th>
                <td>${t.technical_signal ?? t.rsi_signal ?? "-"}</td>
            </tr>

        </table>

    </div>`;
}

function displayFundamental(data) {

    const f = data.fundamental_analysis || data;

    document.getElementById("fundamental").innerHTML = `

    <div class="card shadow p-3 mt-3">

        <h4>Fundamental Analysis</h4>

        <table class="table table-sm">

            <tr>
                <th>Company</th>
                <td>${f.company_name ?? "-"}</td>
            </tr>

            <tr>
                <th>Sector</th>
                <td>${f.sector ?? "-"}</td>
            </tr>

            <tr>
                <th>Market Cap</th>
                <td>${f.market_cap ?? "-"}</td>
            </tr>

            <tr>
                <th>P/E Ratio</th>
                <td>${f.pe_ratio ?? "-"}</td>
            </tr>

            <tr>
                <th>EPS</th>
                <td>${f.eps ?? "-"}</td>
            </tr>

            <tr>
                <th>Dividend Yield</th>
                <td>${f.dividend_yield ?? "-"}</td>
            </tr>

        </table>

    </div>`;
}

function displayChart(chart) {

    if (chart.chart) {

        document.getElementById("chart").innerHTML = chart.chart;

    } else {

        document.getElementById("chart").innerHTML = `
        <div class="alert alert-warning">
            Chart unavailable.
        </div>`;
    }
}