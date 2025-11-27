import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

import { syncToMailerLite } from '../services/mailerlite.service';

import crypto from 'crypto';
import { sendVerificationEmail, isValidEmailDomain } from '../services/email.service';

const generateExampleCurve = (startEquity: number, endBtEquity: number, endRtEquity: number, type: 'trend' | 'mean_reversion' | 'breakout') => {
    const points: any[] = [];
    const btStartDate = new Date('2024-06-01').getTime();
    const btEndDate = new Date('2025-03-01').getTime();
    const rtStartDate = new Date('2025-03-02').getTime();
    const rtEndDate = new Date('2025-11-15').getTime();

    const btPoints = 25;
    const rtPoints = 25;

    // Backtest Generation
    let currentEquity = startEquity;
    const btTotalProfit = endBtEquity - startEquity;

    for (let i = 0; i <= btPoints; i++) {
        const progress = i / btPoints;
        const date = new Date(btStartDate + (btEndDate - btStartDate) * progress).toISOString();

        let noise = (Math.random() - 0.5) * (btTotalProfit * 0.1);
        if (i === 0) noise = 0;
        if (i === btPoints) noise = 0;

        let value = startEquity + (btTotalProfit * progress) + noise;

        // Add specific characteristics
        if (type === 'breakout' && i > btPoints * 0.7) {
            value += (btTotalProfit * 0.2 * (i - btPoints * 0.7) / (btPoints * 0.3)); // Acceleration at end
        }

        points.push({ date, Backtest: Number(value.toFixed(2)) });
        currentEquity = value;
    }

    // Realtime Generation
    const rtTotalChange = endRtEquity - endBtEquity;

    for (let i = 0; i <= rtPoints; i++) {
        const progress = i / rtPoints;
        const date = new Date(rtStartDate + (rtEndDate - rtStartDate) * progress).toISOString();

        let noise = (Math.random() - 0.5) * (Math.abs(rtTotalChange) * 0.2 + 500);
        if (i === 0) noise = 0;
        if (i === rtPoints) noise = 0;

        let value = endBtEquity + (rtTotalChange * progress) + noise;

        // Add specific characteristics
        if (type === 'mean_reversion') {
            // Choppy then drop
            value += Math.sin(i) * 500;
        }
        if (type === 'breakout') {
            // Sharp drop
            if (i > 5) value -= (i * 100);
        }

        // Force end value match
        if (i === rtPoints) value = endRtEquity;

        points.push({ date, 'Real Time': Number(value.toFixed(2)) });
    }

    return points;
};

export const register = async (req: Request, res: Response) => {
    try {
        // Force plan to be 'free' for new registrations
        const { email, password, isPotentialLead } = req.body;
        const plan = 'free';

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Validate email domain (MX records)
        const isDomainValid = await isValidEmailDomain(email);
        if (!isDomainValid) {
            return res.status(400).json({ error: 'Invalid email domain. Please use a valid email address.' });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Calculate subscription status
        let trialEndsAt = null;
        let subscriptionStatus = 'active';

        // In a real app, Premium might start as 'inactive' until payment, 
        // but for this MVP we activate it immediately as requested.
        // Always active for free plan
        subscriptionStatus = 'active';

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                plan,
                subscription_status: subscriptionStatus,
                trial_ends_at: trialEndsAt,
                isPotentialLead: isPotentialLead || false,
                isVerified: false,
                verificationToken
            } as any
        });



        // Send verification email
        try {
            await sendVerificationEmail(user.email, verificationToken);
        } catch (emailError: any) {
            // Rollback: Delete user if email fails
            await prisma.user.delete({ where: { id: user.id } });
            console.error('Registration rollback: User deleted due to email failure', emailError);
            return res.status(400).json({
                error: 'Failed to send verification email. Please check your email address and try again.'
            });
        }

        res.status(201).json({
            message: 'Account created successfully. Please check your email to verify your account.',
            user: {
                id: user.id,
                email: user.email,
                plan: (user as any).plan
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check verification status
        if (!(user as any).isVerified) {
            return res.status(403).json({
                error: 'Email not verified. Please check your inbox.',
                code: 'EMAIL_NOT_VERIFIED'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.query;

        if (!token || typeof token !== 'string') {
            return res.status(400).json({ error: 'Invalid token' });
        }

        const user = await prisma.user.findFirst({
            where: { verificationToken: token }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification token' });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationToken: null
            } as any
        });

        // Create Example Portfolio
        try {
            const examplePortfolio = await prisma.portfolio.create({
                data: {
                    name: 'Example Portfolio 🚀',
                    ownerId: user.id,
                    isExample: true,
                    metricRules: [
                        {
                            metricId: 'max_drawdown',
                            name: 'Max Drawdown Deviation',
                            alertThreshold: 15,
                            deactivationThreshold: 20,
                            isAlerting: true
                        },
                        {
                            metricId: 'profit_factor',
                            name: 'Profit Factor Deviation',
                            alertThreshold: 10,
                            deactivationThreshold: 15,
                            isAlerting: true
                        }
                    ],
                    strategies: {
                        create: [
                            {
                                magicNumber: 1001,
                                name: 'Trend Follower EURUSD',
                                symbol: 'EURUSD',
                                timeframe: 'H1',
                                typology: 'Trend',
                                extractionType: 'Idea Driven',
                                status: 'ok',
                                metrics: [
                                    { id: 'net_profit', name: 'Net Profit', unit: '$', backtestValue: 12000, realtimeValue: 15000, backtestValueAlt: '25.0', realtimeValueAlt: '30.0' },
                                    { id: 'num_trades', name: 'Nº Trades', unit: '', backtestValue: 150, realtimeValue: 45 },
                                    { id: 'profit_factor', name: 'Profit Factor', unit: '', backtestValue: 1.6, realtimeValue: 1.8 },
                                    { id: 'ret_dd_ratio', name: 'Ret/DD', unit: '', backtestValue: 6.67, realtimeValue: 8.33 },
                                    { id: 'avg_trade', name: 'Avg. Trade', unit: '$', backtestValue: 80, realtimeValue: 333 },
                                    { id: 'max_drawdown', name: 'Max DD', unit: '$', backtestValue: 1800, realtimeValue: 1800, backtestValueAlt: '15.0', realtimeValueAlt: '12.0' },
                                    { id: 'win_rate', name: 'Winrate', unit: '%', backtestValue: 50, realtimeValue: 55 },
                                    { id: 'stagnation_days', name: 'Stagnation', unit: 'days', backtestValue: 45, realtimeValue: 15 }
                                ],
                                pnlCurve: generateExampleCurve(10000, 22000, 25000, 'trend')
                            },
                            {
                                magicNumber: 1002,
                                name: 'Mean Reversion GBPUSD',
                                symbol: 'GBPUSD',
                                timeframe: 'M15',
                                typology: 'Mean Reversion',
                                extractionType: 'Data Driven',
                                status: 'ok', // Will be recalculated to Alert by frontend
                                metrics: [
                                    { id: 'net_profit', name: 'Net Profit', unit: '$', backtestValue: 8000, realtimeValue: 7500, backtestValueAlt: '15.0', realtimeValueAlt: '14.0' },
                                    { id: 'num_trades', name: 'Nº Trades', unit: '', backtestValue: 200, realtimeValue: 60 },
                                    { id: 'profit_factor', name: 'Profit Factor', unit: '', backtestValue: 1.5, realtimeValue: 1.4 },
                                    { id: 'ret_dd_ratio', name: 'Ret/DD', unit: '', backtestValue: 8.0, realtimeValue: 6.35 },
                                    { id: 'avg_trade', name: 'Avg. Trade', unit: '$', backtestValue: 40, realtimeValue: 125 },
                                    { id: 'max_drawdown', name: 'Max DD', unit: '$', backtestValue: 1000, realtimeValue: 1180, backtestValueAlt: '10.0', realtimeValueAlt: '11.8' },
                                    { id: 'win_rate', name: 'Winrate', unit: '%', backtestValue: 60, realtimeValue: 58 },
                                    { id: 'stagnation_days', name: 'Stagnation', unit: 'days', backtestValue: 30, realtimeValue: 45 }
                                ],
                                pnlCurve: generateExampleCurve(10000, 18000, 17500, 'mean_reversion')
                            },
                            {
                                magicNumber: 1003,
                                name: 'Breakout GOLD',
                                symbol: 'XAUUSD',
                                timeframe: 'H4',
                                typology: 'Breakout',
                                extractionType: 'Data Driven',
                                status: 'ok', // Will be recalculated to Deactivated by frontend
                                metrics: [
                                    { id: 'net_profit', name: 'Net Profit', unit: '$', backtestValue: 20000, realtimeValue: 18000, backtestValueAlt: '40.0', realtimeValueAlt: '35.0' },
                                    { id: 'num_trades', name: 'Nº Trades', unit: '', backtestValue: 100, realtimeValue: 30 },
                                    { id: 'profit_factor', name: 'Profit Factor', unit: '', backtestValue: 2.0, realtimeValue: 1.5 },
                                    { id: 'ret_dd_ratio', name: 'Ret/DD', unit: '', backtestValue: 11.1, realtimeValue: 9.47 },
                                    { id: 'avg_trade', name: 'Avg. Trade', unit: '$', backtestValue: 200, realtimeValue: 600 },
                                    { id: 'max_drawdown', name: 'Max DD', unit: '$', backtestValue: 1800, realtimeValue: 1900, backtestValueAlt: '18.0', realtimeValueAlt: '19.0' },
                                    { id: 'win_rate', name: 'Winrate', unit: '%', backtestValue: 45, realtimeValue: 40 },
                                    { id: 'stagnation_days', name: 'Stagnation', unit: 'days', backtestValue: 60, realtimeValue: 90 }
                                ],
                                pnlCurve: generateExampleCurve(10000, 30000, 28000, 'breakout')
                            }
                        ]
                    }
                }
            });
            console.log(`Example portfolio created for user ${user.id}`);
        } catch (error) {
            console.error('Failed to create example portfolio:', error);
            // Continue execution, don't fail verification
        }

        // Sync to MailerLite (Fire and Forget) - Only after verification
        syncToMailerLite({
            email: user.email,
            plan: (user as any).plan,
            isPotentialLead: (user as any).isPotentialLead
        });

        // Generate JWT for auto-login
        const jwtToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Email verified successfully',
            token: jwtToken,
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({ error: 'Failed to verify email' });
    }
};
export const getMe = async (req: any, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                email: true,
                plan: true,
                subscription_status: true
            } as any
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};

export const updateProfile = async (req: any, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await prisma.user.update({
            where: { id: req.userId },
            data: { email },
            select: {
                id: true,
                email: true,
                plan: true
            } as any
        });

        res.json(user);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

export const updatePassword = async (req: any, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password are required' });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.userId }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid current password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: req.userId },
            data: { password: hashedPassword }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ error: 'Failed to update password' });
    }
};
