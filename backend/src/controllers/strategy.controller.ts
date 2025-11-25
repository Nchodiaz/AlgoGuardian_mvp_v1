import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../prisma';
import { analyzeStrategy } from '../services/analysis.service';
import { PLAN_LIMITS, PlanType } from '../config/limits';

export const getStrategies = async (req: AuthRequest, res: Response) => {
    try {
        const { portfolioId } = req.params;

        // Verify portfolio ownership
        const portfolio = await prisma.portfolio.findFirst({
            where: { id: portfolioId, ownerId: req.userId }
        });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const strategies = await prisma.strategy.findMany({
            where: { portfolioId }
        });

        res.json(strategies);
    } catch (error) {
        console.error('Get strategies error:', error);
        res.status(500).json({ error: 'Failed to fetch strategies' });
    }
};

export const getStrategyById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const strategy = await prisma.strategy.findUnique({
            where: { id },
            include: { portfolio: true }
        });

        if (!strategy || strategy.portfolio.ownerId !== req.userId) {
            return res.status(404).json({ error: 'Strategy not found' });
        }

        res.json(strategy);
    } catch (error) {
        console.error('Get strategy error:', error);
        res.status(500).json({ error: 'Failed to fetch strategy' });
    }
};

export const uploadStrategy = async (req: AuthRequest, res: Response) => {
    try {
        const { portfolioId } = req.params;
        const { name, symbol, timeframe, typology, extractionType } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (!files || !files.backtest || !files.realtime) {
            return res.status(400).json({ error: 'Both backtest and realtime files are required' });
        }

        // Verify portfolio ownership
        const portfolio = await prisma.portfolio.findFirst({
            where: { id: portfolioId, ownerId: req.userId }
        });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const backtestFile = files.backtest[0];
        const realtimeFile = files.realtime[0];

        // Read file contents
        const backtestContent = backtestFile.buffer.toString('utf-8');
        const realtimeContent = realtimeFile.buffer.toString('utf-8');

        console.log(`Processing upload for portfolio ${portfolioId}`);
        console.log(`Backtest file size: ${backtestContent.length} bytes`);
        console.log(`Realtime file size: ${realtimeContent.length} bytes`);

        // Check strategy limits
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            include: {
                portfolios: {
                    include: { strategies: true }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const plan = ((user as any).plan as PlanType) || 'free';
        const limits = PLAN_LIMITS[plan];

        const totalStrategies = user.portfolios.reduce((acc, p) => acc + p.strategies.length, 0);

        if (totalStrategies >= limits.strategies) {
            return res.status(403).json({
                error: `Plan limit reached. You can only have ${limits.strategies} active strategies on the ${plan} plan.`
            });
        }

        // Analyze files
        console.log('Starting analysis...');
        const { metrics, pnlCurve, magicNumber } = analyzeStrategy(backtestContent, realtimeContent);
        console.log('Analysis complete. Saving to database...');

        // Create strategy
        const strategy = await prisma.strategy.create({
            data: {
                portfolioId,
                name: name || backtestFile.originalname,
                symbol: symbol || 'MULTI',
                timeframe: timeframe || 'VARIOUS',
                typology: typology || null,
                extractionType: extractionType || null,
                magicNumber,
                status: 'ok',
                metrics: metrics as any,
                pnlCurve: pnlCurve as any
            }
        });

        res.status(201).json({
            success: true,
            strategy,
            message: `Analyzed ${metrics.find(m => m.id === 'num_trades')?.backtestValue} BT and ${metrics.find(m => m.id === 'num_trades')?.realtimeValue} RT trades.`
        });
    } catch (error: any) {
        console.error('Upload strategy error:', error);
        res.status(500).json({ error: error.message || 'Failed to upload strategy' });
    }
};

export const updateStrategy = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, symbol, timeframe, typology, extractionType, status } = req.body;

        const strategy = await prisma.strategy.findUnique({
            where: { id },
            include: { portfolio: true }
        });

        if (!strategy || strategy.portfolio.ownerId !== req.userId) {
            return res.status(404).json({ error: 'Strategy not found' });
        }

        const updated = await prisma.strategy.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(symbol && { symbol }),
                ...(timeframe && { timeframe }),
                ...(typology && { typology }),
                ...(extractionType && { extractionType }),
                ...(status && { status })
            }
        });

        res.json(updated);
    } catch (error) {
        console.error('Update strategy error:', error);
        res.status(500).json({ error: 'Failed to update strategy' });
    }
};

export const deleteStrategy = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const strategy = await prisma.strategy.findUnique({
            where: { id },
            include: { portfolio: true }
        });

        if (!strategy || strategy.portfolio.ownerId !== req.userId) {
            return res.status(404).json({ error: 'Strategy not found' });
        }

        await prisma.strategy.delete({
            where: { id }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Delete strategy error:', error);
        res.status(500).json({ error: 'Failed to delete strategy' });
    }
};
