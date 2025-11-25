import React from 'react';

const TestimonialCard: React.FC<{ quote: string; author: string; title: string; }> = ({ quote, author, title }) => (
    <div className="bg-gray-800 p-8 rounded-lg ring-1 ring-gray-700">
        <p className="text-gray-300 italic">"{quote}"</p>
        <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="font-semibold text-white">{author}</p>
            <p className="text-sm text-primary-400">{title}</p>
        </div>
    </div>
);

export const TestimonialsSection: React.FC = () => {
    return (
        <section id="testimonials" className="py-20 lg:py-24 bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-white">Trusted by Traders Who Demand an Edge</h2>
                </div>
                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <TestimonialCard 
                        quote="AlgoGuardian caught a drift in my main EURUSD strategy that I would have missed for weeks. It saved me from a significant drawdown." 
                        author="Alex, Quant Trader"
                        title="QuantFund"
                    />
                    <TestimonialCard 
                        quote="Being able to see how my strategies correlate has been a game-changer. I've built a much more balanced portfolio and can sleep better knowing my risks are properly managed." 
                        author="Maria, FX Algo Developer"
                        title="Momentum Labs"
                    />
                     <TestimonialCard 
                        quote="Finally, a tool that understands the statistical reality of algorithmic trading. The portfolio view and correlation matrix are indispensable for managing risk at scale." 
                        author="Chen, Hedge Fund PM"
                        title="Vertex Capital"
                    />
                </div>
            </div>
        </section>
    )
}