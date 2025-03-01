import { sendEmail } from './service';
import { getWelcomeEmailTemplate } from './templates/welcome';
import type { User } from '@/lib/db/schema/users';

export const sendWelcomeEmail = async (user: User) => {
    const template = getWelcomeEmailTemplate({
        firstName: user.firstName || 'there',
        credits: user.credits
    });

    await sendEmail({
        to: {
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || '',
            address: user.email
        },
        subject: template.subject,
        text: template.text,
        html: template.html
    });
}; 