import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../prisma';
import { PLAN_LIMITS, PlanType } from '../config/limits';

export const getPortfolios = async (req: AuthRequest, res: Response) => {
    try {
        const portfolios = await prisma.portfolio.findMany({
            where: { ownerId: req.userId },
            include: {
                strategies: true
            }
        });

        res.json(portfolios);
    } catch (error) {
        console.error('Get portfolios error:', error);
        res.status(500).json({ error: 'Failed to fetch portfolios' });
    }
};

export const createPortfolio = async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Portfolio name is required' });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            include: { portfolios: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const plan = ((user as any).plan as PlanType) || 'free';
        const limits = PLAN_LIMITS[plan];

        if (user.portfolios.length >= limits.portfolios) {
            return res.status(403).json({
                error: `Plan limit reached. You can only create ${limits.portfolios} portfolios on the ${plan} plan.`
            });
        }

        const portfolio = await prisma.portfolio.create({
            data: {
                name,
                ownerId: req.userId!,
                metricRules: []
            }
        });

        res.status(201).json(portfolio);
    } catch (error) {
        console.error('Create portfolio error:', error);
        res.status(500).json({ error: 'Failed to create portfolio' });
    }
};

export const updatePortfolio = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, metricRules } = req.body;

        // Verify ownership
        const portfolio = await prisma.portfolio.findFirst({
            where: { id, ownerId: req.userId }
        });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const updated = await prisma.portfolio.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(metricRules && { metricRules })
            }
        });

        res.json(updated);
    } catch (error) {
        console.error('Update portfolio error:', error);
        res.status(500).json({ error: 'Failed to update portfolio' });
    }
};

export const deletePortfolio = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Verify ownership
        const portfolio = await prisma.portfolio.findFirst({
            where: { id, ownerId: req.userId }
        });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        await prisma.portfolio.delete({
            where: { id }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Delete portfolio error:', error);
        res.status(500).json({ error: 'Failed to delete portfolio' });
    }
};
