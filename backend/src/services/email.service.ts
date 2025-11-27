import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

export const sendVerificationEmail = async (email: string, token: string) => {
    if (!resend) {
        console.warn('RESEND_API_KEY not found. Skipping email sending.');
        console.log(`[DEV] Verification Token for ${email}: ${token}`);
        return;
    }

    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').trim().replace(/\/$/, '');
    const verificationUrl = `${frontendUrl}/verify?token=${token}`;

    console.log('[DEBUG] Frontend URL:', frontendUrl);
    console.log('[DEBUG] Verification URL:', verificationUrl);

    try {
        const data = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'AlgoGuardian <onboarding@resend.dev>',
            to: [email],
            subject: 'Verify your AlgoGuardian account (Debug)',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1>Welcome to AlgoGuardian! 🛡️</h1>
                    <p>Please verify your email address to activate your account.</p>
                    <a href="${verificationUrl}" style="display: inline-block; background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email</a>
                    <p style="margin-top: 20px; font-size: 12px; color: #666;">If you didn't create this account, you can safely ignore this email.</p>
                    <p style="font-size: 10px; color: #999;">Debug URL: ${verificationUrl}</p>
                </div>
            `
        });
        console.log(`Verification email sent to ${email}. ID: ${data.data?.id}`);

        if (data.error) {
            throw new Error(data.error.message);
        }
    } catch (error) {
        console.error('Failed to send verification email:', error);
        throw error; // Re-throw to be caught by controller
    }
};
