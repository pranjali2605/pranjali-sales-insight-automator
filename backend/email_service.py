import resend
import os
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")

def send_email(to_email, summary):

    params = {
        "from": "Sales Insight <onboarding@resend.dev>",
        "to": [to_email],
        "subject": "Sales Insight Report",
        "html": f"<p>{summary}</p>"
    }

    resend.Emails.send(params)