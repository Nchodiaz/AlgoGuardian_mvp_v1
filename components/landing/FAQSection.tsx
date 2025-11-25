import React, { useState } from 'react';
import { ChevronRightIcon } from '../Icons';

const FaqItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-700 py-6">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left">
                <h4 className="text-lg font-medium text-white">{title}</h4>
                <ChevronRightIcon className={`h-6 w-6 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-4 text-gray-300 animate-fade-in-down">
                    {children}
                </div>
            )}
        </div>
    )
}

export const FAQSection: React.FC = () => {
    return (
        <section id="faq" className="py-20 lg:py-24 bg-gray-900">
            <div className="container mx-auto px-4 max-w-3xl">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-white">Frequently Asked Questions</h2>
                 </div>

                 <div>
                    <FaqItem title="What trading report formats are supported?">
                        <p>AlgoGuardian is designed to be flexible. We natively support Strategy Tester reports from MetaTrader 4 and MetaTrader 5 (.html, .csv, .txt). We also support generic CSV files with 'profit' and 'close time' columns, making it compatible with reports from QuantConnect, NinjaTrader, and most other platforms.</p>
                    </FaqItem>
                     <FaqItem title="Is my trading data secure?">
                        <p>Absolutely. Security is our top priority. We do not store your raw trading reports. All data is processed in-memory, and only the calculated statistical metrics are saved to our encrypted database. Your trading logic and intellectual property remain yours alone.</p>
                    </FaqItem>
                     <FaqItem title="How is the 'Drift Score' calculated?">
                        <p>The Drift Score is a proprietary metric calculated by a mathematical formula. It aggregates the statistical significance (p-values) of deviations across multiple key performance indicators (KPIs). The formula weighs metrics with lower p-values more heavily and considers whether the deviation is negative (e.g., lower profit factor, higher drawdown) to produce a single, easy-to-understand score representing your strategy's health.</p>
                    </FaqItem>
                      <FaqItem title="Can I cancel my subscription at any time?">
                        <p>Yes. You can cancel your subscription at any time from your account settings. You will retain access to paid features until the end of your current billing period, and your account will then be downgraded to the free plan.</p>
                    </FaqItem>
                 </div>
            </div>
             <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down { animation: fadeInDown 0.3s ease-out forwards; }
            `}</style>
        </section>
    )
}