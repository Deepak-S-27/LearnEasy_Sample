/**
 * Email sending utility. Uses Resend API, SMTP, or Ethereal (test inbox).
 *
 * For local development without Gmail/SMTP, set:
 *   USE_ETHEREAL=true
 * and the server will log a preview URL for the sent message.
 */

export type SendOtpResult = { success: true } | { success: false; error: string }

export async function sendOtpEmail(
  to: string,
  otp: string,
  purpose: "login" | "signup" | "forgot_password"
): Promise<SendOtpResult> {
  const subject =
    purpose === "forgot_password"
      ? "LearnEasy - Reset your password"
      : purpose === "signup"
        ? "LearnEasy - Verify your email"
        : "LearnEasy - Your login code"

  const body =
    purpose === "forgot_password"
      ? `Use this code to reset your password: ${otp}. It expires in 10 minutes.`
      : purpose === "signup"
        ? `Welcome to LearnEasy! Your verification code is: ${otp}. It expires in 10 minutes.`
        : `Your login verification code is: ${otp}. It expires in 10 minutes.`

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #2563eb;">LearnEasy</h2>
      <p>${body.replace(otp, `<strong>${otp}</strong>`)}</p>
      <p style="color: #64748b; font-size: 12px;">If you didn't request this, please ignore this email.</p>
    </div>
  `

  // 1. Resend (recommended: free tier, single API key)
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    try {
      const { Resend } = await import("resend")
      const resend = new Resend(resendKey)
      const from = process.env.RESEND_FROM || "LearnEasy <onboarding@resend.dev>"
      const { error } = await resend.emails.send({
        from: from.includes("<") ? from : `LearnEasy <${from}>`,
        to: [to],
        subject,
        html,
        text: body,
      })
      if (error) return { success: false, error: error.message }
      return { success: true }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send email"
      return { success: false, error: msg }
    }
  }

  // 2. Nodemailer SMTP (Gmail, Outlook, etc.)
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (host && user && pass) {
    try {
      const nodemailer = await import("nodemailer")
      const port = parseInt(process.env.SMTP_PORT || "587", 10)
      const transport = nodemailer.default.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      })
      await transport.sendMail({
        from: process.env.SMTP_FROM || "LearnEasy <noreply@learneasy.in>",
        to,
        subject,
        text: body,
        html,
      })
      return { success: true }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send email"
      return { success: false, error: msg }
    }
  }

  // 3. Ethereal (test inbox) - no real email delivery, but you get a preview URL.
  if (process.env.USE_ETHEREAL === "true") {
    try {
      const nodemailer = await import("nodemailer")
      const test = await nodemailer.default.createTestAccount()
      const transport = nodemailer.default.createTransport({
        host: test.smtp.host,
        port: test.smtp.port,
        secure: test.smtp.secure,
        auth: { user: test.user, pass: test.pass },
      })

      const info = await transport.sendMail({
        from: process.env.ETHEREAL_FROM || "LearnEasy <no-reply@learneasy.local>",
        to,
        subject,
        text: body,
        html,
      })

      const previewUrl = nodemailer.default.getTestMessageUrl(info)
      if (previewUrl) {
        console.log(`[LearnEasy] Ethereal preview URL: ${previewUrl}`)
      }
      return { success: true }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send email"
      return { success: false, error: msg }
    }
  }

  return {
    success: false,
    error:
      "Email service not configured. Set RESEND_API_KEY, SMTP_HOST/SMTP_USER/SMTP_PASS, or USE_ETHEREAL=true in .env",
  }
}
