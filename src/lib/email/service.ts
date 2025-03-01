import Mail from 'nodemailer/lib/mailer';
import { transport, defaultSender } from './config';

export type SendEmailOptions = {
    to: Mail.Address | Mail.Address[];
    subject: string;
    text?: string;
    html?: string;
    from?: Mail.Address;
}

export const sendEmail = async (options: SendEmailOptions) => {
    const { to, subject, text, html, from = defaultSender } = options;
    
    return transport.sendMail({
        from,
        to,
        subject,
        text,
        html
    });
} 