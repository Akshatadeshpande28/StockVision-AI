const API = "https://literate-journey-q7p44vgvg567h67vq-8000.app.github.dev";

async function testBackend() {
    const result = document.getElementById("result");

    result.innerHTML = `
        <div class="alert alert-info">
            Connecting to StockVision AI backend...
        </div>
    `;

    try {
        console.log("Backend URL:", API);

        const response = await fetch(`${API}/`);

        console.log("Response status:", response.status);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        console.log("Backend response:", data);

        result.innerHTML = `
            <div class="alert alert-success">
                <strong>Backend Connected Successfully ✅</strong>
                <br><br>
                ${data.message}
                <br>
                ${data.status}
            </div>
        `;

    } catch (error) {

        console.error("Backend connection error:", error);

        result.innerHTML = `
            <div class="alert alert-danger">
                <strong>Backend Connection Failed ❌</strong>
                <br><br>
                ${error.message}
            </div>
        `;
    }
}