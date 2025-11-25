import os
import aiosmtplib
from email.message import EmailMessage

async def send_reset_email(to_email: str, reset_token: str):
    msg = EmailMessage()
    msg["From"] = os.getenv("SMTP_EMAIL")
    msg["To"] = to_email
    msg["Subject"] = "Réinitialisation mot de passe"
    
    reset_link = f"https://zerodance.preview.emergentagent.com/admin/reset-password?token={reset_token}"
    msg.set_content(f"Cliquez sur ce lien pour réinitialiser votre mot de passe: {reset_link}")
    
    await aiosmtplib.send(
        msg,
        hostname=os.getenv("SMTP_HOST"),
        port=int(os.getenv("SMTP_PORT")),
        username=os.getenv("SMTP_EMAIL"),
        password=os.getenv("SMTP_PASSWORD"),
        start_tls=True
    )
