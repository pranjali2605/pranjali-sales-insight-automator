import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_summary(data_text):

    prompt = f"""
You are a professional business analyst.

Analyze the following sales dataset summary and produce a professional executive report.

Focus on:
- revenue trends
- top performing regions
- product performance
- key business insights

Sales Data Summary:
{data_text}
"""

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return completion.choices[0].message.content