import nodemailer from 'nodemailer';
import { getResultsReadyEmail } from './templates';

export async function sendNotificationEmail(
  to: string,
  displayName: string,
  locationCount: number
): Promise<void> {
  try {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPassword = process.env.GMAIL_APP_PASSWORD;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!gmailUser || !gmailPassword) {
      process.stderr.write(
        '[Roost] Email not sent — missing GMAIL_USER or GMAIL_APP_PASSWORD env vars\n'
      );
      return;
    }

    if (!appUrl) {
      process.stderr.write(
        '[Roost] Email not sent — missing NEXT_PUBLIC_APP_URL env var\n'
      );
      return;
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
    });

    const dashboardUrl = `${appUrl}/dashboard`;
    const { subject, html } = getResultsReadyEmail(
      displayName,
      locationCount,
      dashboardUrl
    );

    await transporter.sendMail({
      from: `"Roost" <${gmailUser}>`,
      to,
      subject,
      html,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    // Email failure should not break the pipeline — log and continue
    process.stderr.write(
      `[Roost] Failed to send notification email to ${to}: ${message}\n`
    );
  }
}
