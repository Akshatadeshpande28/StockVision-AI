async function analyzeStock() {

    const symbol = document.getElementById("symbol").value;

    if (!symbol) {
        alert("Please enter a stock symbol");
        return;
    }

    const API = "http://127.0.0.1:8000";

    try {

        const response = await fetch(`${API}/analysis/${symbol}`);

        const data = await response.json();

        document.getElementById("summary").innerHTML = `
            <div class="card p-3 shadow">

                <h3>${data.symbol}</h3>

                <p><b>Trend:</b> ${data.analysis.trend}</p>

                <p><b>Current Price:</b> ₹${data.analysis.current_price}</p>

                <p><b>Average Price:</b> ₹${data.analysis.average_price}</p>

                <p><b>Price Change:</b> ${data.analysis.price_change}</p>

            </div>
        `;

    }

    catch(err){

        console.log(err);

        alert("Unable to connect to backend.");

    }

}