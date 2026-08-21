const API = "https://literate-journey-q7p44vgvg567h67vq-8000.app.github.dev";

async function testBackend() {

    const result = document.getElementById("result");

    result.innerHTML = `
        <div class="alert alert-info">
            Connecting to backend...
        </div>
    `;

    try {

        const response = await fetch(`${API}/`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        result.innerHTML = `
            <div class="alert alert-success">
                <strong>Backend Connected! ✅</strong>
                <br><br>
                ${data.message}
                <br>
                Status: ${data.status}
            </div>
        `;

        console.log("Backend response:", data);

    } catch (error) {

        console.error("Backend connection error:", error);

        result.innerHTML = `
            <div class="alert alert-danger">
                <strong>Backend Connection Failed ❌</strong>
                <br>
                ${error.message}
            </div>
        `;
    }
}