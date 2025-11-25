import React from 'react';
import { CheckCircleIcon } from '../Icons';

interface PricingSectionProps {
    onPlanSelect: (plan: string) => void;
}

const PlanFeature: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-center space-x-3">
        <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
        <span className="text-gray-300">{children}</span>
    </li>
);

export const PricingSection: React.FC<PricingSectionProps> = ({ onPlanSelect }) => {
    return (
        <section id="pricing" className="py-20 lg:py-24 bg-gray-900/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-white">Find the Plan That's Right For You</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                        Start for free, and scale as your trading operation grows.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
                    {/* Free Plan */}
                    <div className="bg-gray-800 p-8 rounded-lg ring-1 ring-gray-700 h-full flex flex-col">
                        <h3 className="text-2xl font-semibold text-white">Free</h3>
                        <p className="mt-2 text-gray-400 min-h-[3rem]">For traders getting started.</p>
                        <p className="mt-6 text-4xl font-bold text-white">€0 <span className="text-lg font-medium text-gray-400">/ month</span></p>
                        <ul className="mt-8 space-y-4 text-sm flex-grow">
                            <PlanFeature>2 Portfolios</PlanFeature>
                            <PlanFeature>6 Active Strategies</PlanFeature>
                            <PlanFeature>Core Drift Analysis</PlanFeature>
                            <PlanFeature>Community Support</PlanFeature>
                        </ul>
                        <button onClick={() => onPlanSelect('free')} className="w-full mt-8 px-6 py-3 font-semibold rounded-md bg-gray-600 hover:bg-gray-500 text-white transition-colors">
                            Sign Up
                        </button>
                    </div>

                    {/* Premium Plan - Highlighted */}
                    <div className="bg-gray-800 p-8 rounded-lg ring-2 ring-primary-500 relative h-full flex flex-col shadow-2xl shadow-primary-500/20">
                        <p className="absolute top-0 -translate-y-1/2 bg-primary-500 text-white text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full">Most Popular</p>
                        <h3 className="text-2xl font-semibold text-primary-400">Premium</h3>
                        <p className="mt-2 text-gray-400 min-h-[3rem]">For serious traders and small teams.</p>
                        <p className="mt-6 text-4xl font-bold text-white">€8.33 <span className="text-lg font-medium text-gray-400">/ month</span></p>
                        <ul className="mt-8 space-y-4 text-sm flex-grow">
                            <PlanFeature>10 Portfolios</PlanFeature>
                            <PlanFeature>50 Active Strategies</PlanFeature>
                            <PlanFeature>Custom Alert Thresholds</PlanFeature>

                            <PlanFeature>Priority Support</PlanFeature>
                        </ul>
                        <button onClick={() => onPlanSelect('premium')} className="w-full mt-8 px-6 py-3 font-semibold rounded-md bg-primary-600 hover:bg-primary-700 text-white transition-colors">
                            Start Premium
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-gray-800 p-8 rounded-lg ring-1 ring-gray-700 h-full flex flex-col">
                        <h3 className="text-2xl font-semibold text-white">Pro</h3>
                        <p className="mt-2 text-gray-400 min-h-[3rem]">For professional firms and power users.</p>
                        <p className="mt-6 text-4xl font-bold text-white">€14.99 <span className="text-lg font-medium text-gray-400">/ month</span></p>
                        <ul className="mt-8 space-y-4 text-sm flex-grow">
                            <PlanFeature>20 Portfolios</PlanFeature>
                            <PlanFeature>200 Active Strategies</PlanFeature>
                            <PlanFeature>Portfolio Management Features</PlanFeature>
                            <PlanFeature>Email Notifications</PlanFeature>
                            <PlanFeature>On-premise Deployment Options</PlanFeature>
                            <PlanFeature>Dedicated Support</PlanFeature>
                        </ul>
                        <button disabled className="w-full mt-8 px-6 py-3 font-semibold rounded-md bg-gray-700 text-gray-400 cursor-not-allowed">
                            Coming Soon...
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};