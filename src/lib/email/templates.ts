export function getResultsReadyEmail(
  displayName: string,
  locationCount: number,
  dashboardUrl: string
): { subject: string; html: string } {
  const subject = 'Your Roost results are ready!';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: Georgia, 'Times New Roman', serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF7F2;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: #3B2F2F; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #FAF7F2; font-size: 28px; font-weight: 700; letter-spacing: 1px;">Roost</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px 0; color: #3B2F2F; font-size: 22px; font-weight: 600;">
                Hi ${displayName},
              </h2>
              <p style="margin: 0 0 24px 0; color: #5A4A42; font-size: 16px; line-height: 1.6;">
                We've found ${locationCount} location${locationCount === 1 ? '' : 's'} that could be a great fit for your next chapter. Your personalized report includes job matches, housing options, and lifestyle insights for each city.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 6px; background-color: #D4572A;">
                    <a href="${dashboardUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; color: #FFFFFF; font-size: 16px; font-weight: 600; text-decoration: none; font-family: Georgia, 'Times New Roman', serif;">
                      View Your Results
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 32px 0 0 0; color: #8A7B74; font-size: 14px; line-height: 1.5;">
                Your results will be available on your dashboard anytime you want to revisit them.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #F5F0EB; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #8A7B74; font-size: 12px;">
                You received this email because you signed up for Roost.
              </p>
              <p style="margin: 0; color: #8A7B74; font-size: 12px;">
                <a href="${dashboardUrl}/settings" style="color: #D4572A; text-decoration: underline;">Unsubscribe</a> from notification emails.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}
