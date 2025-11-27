import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

import { syncToMailerLite } from '../services/mailerlite.service';

import crypto from 'crypto';
import { sendVerificationEmail, isValidEmailDomain } from '../services/email.service';

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
                                metrics: JSON.stringify([
                                    { id: 'net_profit', backtestValue: 12000, realtimeValue: 15000 },
                                    { id: 'profit_factor', backtestValue: 1.6, realtimeValue: 1.8 },
                                    { id: 'win_rate', backtestValue: 50, realtimeValue: 55 },
                                    { id: 'max_drawdown', backtestValue: 15, realtimeValue: 12 },
                                    { id: 'num_trades', backtestValue: 150, realtimeValue: 45 }
                                ]),
                                pnlCurve: JSON.stringify([
                                    { date: '2024-06-01T00:00:00.000Z', Backtest: 10000 },
                                    { date: '2024-09-01T00:00:00.000Z', Backtest: 11000 },
                                    { date: '2024-12-01T00:00:00.000Z', Backtest: 12000 },
                                    { date: '2025-03-01T00:00:00.000Z', Backtest: 13000 },
                                    { date: '2025-03-02T00:00:00.000Z', 'Real Time': 13000 },
                                    { date: '2025-06-01T00:00:00.000Z', 'Real Time': 14000 },
                                    { date: '2025-09-01T00:00:00.000Z', 'Real Time': 14500 },
                                    { date: '2025-11-15T00:00:00.000Z', 'Real Time': 15000 }
                                ])
                            },
                            {
                                magicNumber: 1002,
                                name: 'Mean Reversion GBPUSD',
                                symbol: 'GBPUSD',
                                timeframe: 'M15',
                                typology: 'Mean Reversion',
                                extractionType: 'Data Driven',
                                status: 'ok', // Will be recalculated to Alert by frontend
                                metrics: JSON.stringify([
                                    { id: 'net_profit', backtestValue: 8000, realtimeValue: 7500 },
                                    { id: 'profit_factor', backtestValue: 1.5, realtimeValue: 1.4 },
                                    { id: 'win_rate', backtestValue: 60, realtimeValue: 58 },
                                    { id: 'max_drawdown', backtestValue: 10, realtimeValue: 11.8 }, // 18% deviation (Alert > 15%)
                                    { id: 'num_trades', backtestValue: 200, realtimeValue: 60 }
                                ]),
                                pnlCurve: JSON.stringify([
                                    { date: '2024-06-01T00:00:00.000Z', Backtest: 10000 },
                                    { date: '2024-10-01T00:00:00.000Z', Backtest: 10200 },
                                    { date: '2025-03-01T00:00:00.000Z', Backtest: 10500 },
                                    { date: '2025-03-02T00:00:00.000Z', 'Real Time': 10500 },
                                    { date: '2025-07-01T00:00:00.000Z', 'Real Time': 10200 },
                                    { date: '2025-11-15T00:00:00.000Z', 'Real Time': 10000 }
                                ])
                            },
                            {
                                magicNumber: 1003,
                                name: 'Breakout GOLD',
                                symbol: 'XAUUSD',
                                timeframe: 'H4',
                                typology: 'Breakout',
                                extractionType: 'Data Driven',
                                status: 'ok', // Will be recalculated to Deactivated by frontend
                                metrics: JSON.stringify([
                                    { id: 'net_profit', backtestValue: 20000, realtimeValue: 18000 },
                                    { id: 'profit_factor', backtestValue: 2.0, realtimeValue: 1.5 }, // 25% deviation (Deactivate > 15%)
                                    { id: 'win_rate', backtestValue: 45, realtimeValue: 40 },
                                    { id: 'max_drawdown', backtestValue: 18, realtimeValue: 19 },
                                    { id: 'num_trades', backtestValue: 100, realtimeValue: 30 }
                                ]),
                                pnlCurve: JSON.stringify([
                                    { date: '2024-06-01T00:00:00.000Z', Backtest: 10000 },
                                    { date: '2024-09-01T00:00:00.000Z', Backtest: 12000 },
                                    { date: '2025-01-01T00:00:00.000Z', Backtest: 15000 },
                                    { date: '2025-03-01T00:00:00.000Z', Backtest: 16000 },
                                    { date: '2025-03-02T00:00:00.000Z', 'Real Time': 16000 },
                                    { date: '2025-08-01T00:00:00.000Z', 'Real Time': 15500 },
                                    { date: '2025-11-15T00:00:00.000Z', 'Real Time': 15000 }
                                ])
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
