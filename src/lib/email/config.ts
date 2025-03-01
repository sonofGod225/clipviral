import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
} as SMTPTransport.Options);

export const defaultSender: Mail.Address = {
    name: process.env.MAIL_FROM_NAME || 'ClipViral',
    address: process.env.MAIL_FROM_EMAIL || 'noreply@clipviral.com',
} 