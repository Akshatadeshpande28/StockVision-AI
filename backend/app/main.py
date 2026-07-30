from fastapi import FastAPI

app = FastAPI(
    title="StockVision AI",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Welcome to StockVision AI 🚀",
        "status": "Backend Running"
    }