const API = "https://special-halibut-4jwvvq9q9pqv25rg5-8000.app.github.dev"

async function analyzeStock() {

    const symbol = document.getElementById("symbol").value.trim();

    if (!symbol) {
        alert("Please enter a stock symbol.");
        return;
    }

    document.getElementById("summary").innerHTML =
        "<h4>Loading...</h4>";

    try {

        const summaryRes = await fetch(`${API}/analysis/${symbol}`);
        const technicalRes = await fetch(`${API}/technical/${symbol}`);
        const fundamentalRes = await fetch(`${API}/fundamentals/${symbol}`);
        const chartRes = await fetch(`${API}/chart/${symbol}`);

        const summary = await summaryRes.json();
        const technical = await technicalRes.json();
        const fundamental = await fundamentalRes.json();
        const chart = await chartRes.json();

        displaySummary(summary);
        displayTechnical(technical);
        displayFundamental(fundamental);
        displayChart(chart);

    } catch (err) {

        document.getElementById("summary").innerHTML =
            `<div class="alert alert-danger">${err}</div>`;

    }

}