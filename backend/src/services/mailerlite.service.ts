import axios from 'axios';

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const GROUP_FREE = process.env.MAILERLITE_GROUP_FREE;
const GROUP_PREMIUM = process.env.MAILERLITE_GROUP_PREMIUM;
const GROUP_POTENTIAL = process.env.MAILERLITE_GROUP_POTENTIAL;

interface MailerLiteSubscriber {
    email: string;
    fields?: Record<string, any>;
    groups?: string[];
}

export const syncToMailerLite = async (user: { email: string; plan: string; isPotentialLead?: boolean }) => {
    if (!MAILERLITE_API_KEY) {
        console.warn('MailerLite API key not configured. Skipping sync.');
        return;
    }

    try {
        let groupId = GROUP_FREE;

        if (user.plan === 'premium') {
            groupId = GROUP_PREMIUM;
        } else if (user.isPotentialLead) {
            groupId = GROUP_POTENTIAL;
        }

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
