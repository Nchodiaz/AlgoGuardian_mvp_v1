import axios from 'axios';

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const GROUP_FREE = process.env.MAILERLITE_GROUP_FREE;
const GROUP_PREMIUM = process.env.MAILERLITE_GROUP_PREMIUM;

interface MailerLiteSubscriber {
    email: string;
    fields?: Record<string, any>;
    groups?: string[];
}

export const syncToMailerLite = async (user: { email: string; plan: string }) => {
    if (!MAILERLITE_API_KEY) {
        console.warn('MailerLite API key not configured. Skipping sync.');
        return;
    }

    try {
        const groupId = user.plan === 'premium' ? GROUP_PREMIUM : GROUP_FREE;

        const payload: MailerLiteSubscriber = {
            email: user.email,
            groups: groupId ? [groupId] : []
        };

        const response = await axios.post(
            'https://connect.mailerlite.com/api/subscribers',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${MAILERLITE_API_KEY}`
                }
            }
        );

        console.log(`Synced user ${user.email} to MailerLite. ID: ${response.data.data.id}`);
        return response.data.data.id;
    } catch (error: any) {
        console.error('Failed to sync to MailerLite:', error.response?.data || error.message);
        // Fire and forget - do not throw
    }
};
