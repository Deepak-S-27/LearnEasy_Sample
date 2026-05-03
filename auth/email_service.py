from dotenv import load_dotenv
load_dotenv()

import requests
import os

def send_email_otp(email, otp):
    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": os.getenv("BREVO_API_KEY"),
        "content-type": "application/json"
    }

    data = {
        "sender": {"name": "LearnEasy", "email": "deepaks637485@gmail.com"},
        "to": [{"email": email}],
        "subject": "Your Verification Code",
        "htmlContent": f"<h3>Your OTP: {otp}</h3>"
    }

    requests.post(url, headers=headers, json=data)