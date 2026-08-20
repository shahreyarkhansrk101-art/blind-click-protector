import os
import time
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

app = FastAPI(title="Blind Click Protector API")

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Gemini client (it will automatically look for the GEMINI_API_KEY environment variable)
client = genai.Client()

class TermsRequest(BaseModel):
    text: str

# Define the exact structure we want Gemini to return
class TermsAnalysis(BaseModel):
    risk_level: str = Field(description="Low, Medium, or High risk level based on the terms.")
    data_tracking: str = Field(description="Summary of what user data is being tracked.")
    data_selling: str = Field(description="Summary of whether data is shared or sold to third parties.")
    red_flags: str = Field(description="Any hidden privacy traps, binding arbitration clauses, or major red flags.")

@app.get("/")
def read_root():
    return {"status": "Active", "message": "Blind Click Protector AI Backend is running!"}

@app.post("/api/analyze")
def analyze_terms(data: TermsRequest):
    if not data.text.strip():
        raise HTTPException(status_code=400, detail="Terms text cannot be empty.")
    
    prompt = f"Analyze the following Terms of Service or Privacy Policy text and extract the risk breakdown:\n\n{data.text}"
    
    max_retries = 2
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model='gemini-3.7-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=TermsAnalysis,
                    system_instruction="You are a legal-tech cybersecurity expert designed to protect everyday users from predatory Terms of Service agreements."
                ),
            )
            
            raw_text = response.text.strip()
            # Clean up code blocks if Gemini accidentally wraps them
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
                
            analysis_result = json.loads(raw_text.strip())
            
            return {
                "status": "success",
                "risk_level": analysis_result.get("risk_level", "Unknown"),
                "summary": {
                    "data_tracking": analysis_result.get("data_tracking", "N/A"),
                    "data_selling": analysis_result.get("data_selling", "N/A"),
                    "red_flags": analysis_result.get("red_flags", "N/A")
                }
            }
            
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(2) # Wait 2 seconds before retrying
                continue
            else:
                # Fallback response if retries fail due to high demand or other errors
                return {
                    "status": "success",
                    "risk_level": "Medium",
                    "summary": {
                        "data_tracking": "AI model is currently busy or experiencing high demand. Please try scanning again.",
                        "data_selling": "Temporary service delay.",
                        "red_flags": f"Error: {str(e)}"
                    }
                }
