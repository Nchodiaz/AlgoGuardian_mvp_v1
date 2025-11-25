import React from 'react';
import { CogIcon, BellIcon, ChartPieIcon, TrendingUpIcon } from '../Icons';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-gray-800/50 p-6 rounded-lg ring-1 ring-white/10 transition-all duration-300 hover:ring-primary-500 hover:bg-gray-800">
    <div className="flex items-start">
      <div className="flex-shrink-0 bg-primary-600/20 text-primary-400 rounded-lg p-3 mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-gray-400">{children}</p>
      </div>
    </div>
  </div>
);

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 lg:py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white">Gain a Statistical Edge</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            Go beyond simple profit and loss. Understand the statistical health of your trading strategies.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard icon={<TrendingUpIcon className="h-6 w-6" />} title="Detect Drift, Protect Capital">
            Our engine gives you an early warning the moment live performance deviates from your backtest, letting you act before small dips become major drawdowns.
          </FeatureCard>
          <FeatureCard icon={<CogIcon className="h-6 w-6" />} title="Optimize Portfolio Composition">
            Simulate how adding or removing strategies impacts overall performance and risk metrics to build a more robust and diversified portfolio.
          </FeatureCard>
          <FeatureCard icon={<ChartPieIcon className="h-6 w-6" />} title="Visualize Your Entire Portfolio">
            From PNL curves to correlation heatmaps, get a holistic view of your strategies' health and risk exposure on one intuitive dashboard.
          </FeatureCard>
          <FeatureCard icon={<BellIcon className="h-6 w-6" />} title="Trade with Confidence">
            Set custom deviation alerts on key metrics. AlgoGuardian watches the market for you, so you can step away from the screen without worry.
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};