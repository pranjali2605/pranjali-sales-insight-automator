from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import pandas as pd
from ai_service import generate_summary
from email_service import send_email
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Sales Insight Automator API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Sales Insight Automator Running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), email: str = Form(...)):

    # Validate file type
    if not file.filename.endswith((".csv", ".xlsx")):
        raise HTTPException(status_code=400, detail="Only CSV or XLSX allowed")

    try:

        # Read the uploaded file
        if file.filename.endswith(".csv"):
            df = pd.read_csv(file.file)
        else:
            df = pd.read_excel(file.file)

        # Create data summary
        summary = df.describe().to_string()

        # Generate AI insights
        ai_summary = generate_summary(summary)

        # Send the summary to the provided email
        send_email(email, ai_summary)

        # API response
        return {
            "message": "AI summary generated and email sent successfully",
            "email": email,
            "rows": len(df),
            "columns": list(df.columns),
            "summary": ai_summary
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))