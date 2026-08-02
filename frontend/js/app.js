const API = "https://special-halibut-4jwvvq9q9pqv25rg5-8000.app.github.dev"

function displaySummary(data) {

   document.getElementById("summary").innerHTML = `
<div class="text-center mt-4">
    <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
    <p class="mt-2">Loading Stock Data...</p>
</div>


    <div class="col-md-3">
        <div class="card shadow text-center p-3">
            <h6>Current Price</h6>
            <h4>₹${data.current_price ?? "-"}</h4>
        </div>
    </div>

    <div class="col-md-3">
        <div class="card shadow text-center p-3">
            <h6>Recommendation</h6>
            <h4>${data.recommendation ?? "-"}</h4>
        </div>
    </div>

    <div class="col-md-3">
        <div class="card shadow text-center p-3">
            <h6>Trend</h6>
            <h4>${data.trend ?? "-"}</h4>
        </div>
    </div>

    `;
}