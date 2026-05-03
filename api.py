from fastapi import FastAPI
from pydantic import BaseModel
from auth.email_service import send_email_otp
from auth.otp_service import generate_otp, save_otp, verify_otp

app = FastAPI()

class EmailRequest(BaseModel):
    email: str

class VerifyRequest(BaseModel):
    email: str
    otp: str


@app.post("/send-otp")
def send_otp(data: EmailRequest):
    otp = generate_otp()
    save_otp(data.email, otp)
    send_email_otp(data.email, otp)
    return {"message": "OTP sent"}


@app.post("/verify-otp")
def verify(data: VerifyRequest):
    if verify_otp(data.email, data.otp):
        return {"message": "Verified"}
    return {"message": "Invalid OTP"}