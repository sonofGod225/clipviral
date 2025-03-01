import { render } from '@react-email/render';
import WelcomeEmail from '@/emails/WelcomeEmail';

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailProps) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: {
        name: 'ClipViral',
        email: 'noreply@clipviral.ai',
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }

  return response.json();
}

export async function sendWelcomeEmail(email: string, name: string, credits: number) {
  const html = render(WelcomeEmail({ name, credits }));
  
  return sendEmail({
    to: email,
    subject: 'Bienvenue sur ClipViral ! 🎥',
    html,
  });
} 