type WelcomeEmailData = {
    firstName: string;
    credits: number;
};

export const getWelcomeEmailTemplate = (data: WelcomeEmailData) => {
    const { firstName, credits } = data;

    return {
        subject: "Bienvenue sur ClipViral ! 🎉",
        text: `
Bonjour ${firstName},

Bienvenue sur ClipViral ! Nous sommes ravis de vous compter parmi nous.

Vous disposez actuellement de ${credits} crédits pour commencer à créer vos premières vidéos virales.

Pour commencer, rendez-vous sur votre tableau de bord et créez votre première vidéo !

À bientôt,
L'équipe ClipViral
        `.trim(),
        html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #6d28d9;">Bienvenue sur ClipViral ! 🎉</h1>
        
        <p>Bonjour ${firstName},</p>
        
        <p>Nous sommes ravis de vous compter parmi nous.</p>
        
        <p>Vous disposez actuellement de <strong>${credits} crédits</strong> pour commencer à créer vos premières vidéos virales.</p>
        
        <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="background-color: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                Accéder à mon tableau de bord
            </a>
        </div>
        
        <p>À bientôt,<br>L'équipe ClipViral</p>
    </div>
</body>
</html>
        `.trim()
    };
}; 