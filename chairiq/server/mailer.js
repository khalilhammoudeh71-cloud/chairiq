import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const fromEmail = process.env.FROM_EMAIL;

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!smtpHost || !smtpUser || !smtpPass || !fromEmail) {
    console.error('[Mailer] Missing SMTP configuration. Required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL');
    return null;
  }

  const isSecure = smtpPort === 465;

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: isSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    ...(smtpPort === 587 && { requireTLS: true }),
  });

  console.log(`[Mailer] Configured: host=${smtpHost}, port=${smtpPort}, secure=${isSecure}, from=${fromEmail}`);
  return transporter;
}

export async function sendEmail({ to, subject, html, text }) {
  const t = getTransporter();
  if (!t) {
    throw new Error('SMTP not configured — check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL');
  }

  try {
    const info = await t.sendMail({
      from: `"ChairIQ" <${fromEmail}>`,
      to,
      subject,
      html,
      text,
    });

    console.log(`[Mailer] Sent to=${to}, messageId=${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`[Mailer] SMTP error sending to=${to}:`, {
      code: err.code,
      command: err.command,
      responseCode: err.responseCode,
      response: err.response,
      message: err.message,
    });
    throw err;
  }
}

export function buildTreatmentPlanEmail(planUrl, patientName) {
  const greeting = patientName ? `Hi ${patientName},` : 'Hello,';
  const supportEmail = 'Khalil.Hammoudeh@chairiq.online';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color:#111215;padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:600;">ChairIQ</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="color:#333;font-size:16px;line-height:1.6;margin:0 0 16px;">${greeting}</p>
              <p style="color:#333;font-size:16px;line-height:1.6;margin:0 0 32px;">Your dental treatment plan is ready for review. Tap the button below to view your personalized care plan.</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${planUrl}" style="display:inline-block;background-color:#2563eb;color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;">View Your Treatment Plan</a>
                  </td>
                </tr>
              </table>
              <p style="color:#888;font-size:13px;line-height:1.5;margin:32px 0 0;text-align:center;">If the button doesn't work, copy and paste this link into your browser:<br><a href="${planUrl}" style="color:#2563eb;word-break:break-all;">${planUrl}</a></p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f9fa;padding:24px 40px;text-align:center;border-top:1px solid #eee;">
              <p style="color:#666;font-size:13px;line-height:1.6;margin:0 0 8px;">Questions? Contact us at <a href="mailto:${supportEmail}" style="color:#2563eb;text-decoration:none;">${supportEmail}</a></p>
              <p style="color:#999;font-size:12px;line-height:1.5;margin:0;">If you did not request this, ignore this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `${greeting}\n\nYour dental treatment plan is ready for review.\n\nView it here: ${planUrl}\n\nQuestions? Contact us at ${supportEmail}\n\nIf you did not request this, ignore this email.`;

  return { html, text };
}
