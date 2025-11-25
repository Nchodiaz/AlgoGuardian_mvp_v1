import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
    userId?: string;
}

export const updatePlan = async (req: AuthRequest, res: Response) => {
    try {
        const { plan } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!['free', 'premium', 'pro'].includes(plan)) {
            return res.status(400).json({ error: 'Invalid plan' });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Enforce payment method for paid plans
        if (plan !== 'free' && !user.cardLast4) {
            return res.status(400).json({
                error: 'Payment method required',
                code: 'PAYMENT_METHOD_REQUIRED'
            });
        }

        // Update plan
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { plan },
            select: {
                id: true,
                email: true,
                plan: true,
                cardLast4: true,
                cardBrand: true
            } as any // Suppress type error until restart
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Update plan error:', error);
        res.status(500).json({ error: 'Failed to update plan' });
    }
};

export const updatePaymentMethod = async (req: AuthRequest, res: Response) => {
    try {
        const { cardNumber, cvc, expiry } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Mock validation
        if (!cardNumber || cardNumber.length < 15) {
            return res.status(400).json({ error: 'Invalid card number' });
        }

        // Simulate Stripe processing...
        const last4 = cardNumber.slice(-4);
        const brand = getCardBrand(cardNumber);

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                cardLast4: last4,
                cardBrand: brand
            } as any, // Suppress type error until restart
            select: {
                id: true,
                email: true,
                plan: true,
                cardLast4: true,
                cardBrand: true
            } as any
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Update payment method error:', error);
        res.status(500).json({ error: 'Failed to update payment method' });
    }
};

export const getInvoices = async (req: AuthRequest, res: Response) => {
    // Mock invoices
    const invoices = [
        { id: 'inv_1', date: new Date().toISOString(), amount: 2900, status: 'paid', plan: 'Premium' },
        { id: 'inv_2', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), amount: 2900, status: 'paid', plan: 'Premium' },
    ];
    res.json(invoices);
};

// Helper to guess brand
function getCardBrand(number: string): string {
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5')) return 'Mastercard';
    if (number.startsWith('3')) return 'Amex';
    return 'Unknown';
}

export const recordUpgradeAttempt = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { isPotentialLead: true }
        });

        res.json({ message: 'User marked as potential lead' });
    } catch (error) {
        console.error('Record upgrade attempt error:', error);
        res.status(500).json({ error: 'Failed to record upgrade attempt' });
    }
};
