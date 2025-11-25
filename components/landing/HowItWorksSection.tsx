import React from 'react';
import { UploadIcon, ChartPieIcon, CogIcon } from '../Icons';

const Step: React.FC<{ icon: React.ReactNode; number: number; title: string; children: React.ReactNode }> = ({ icon, number, title, children }) => (
  <div className="relative text-center lg:text-left flex flex-col items-center lg:items-start">
    <div className="flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full ring-2 ring-primary-500/50 mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white"><span className="text-primary-400">{number}.</span> {title}</h3>
    <p className="mt-2 text-gray-400 max-w-xs">{children}</p>
  </div>
);

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-24 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white">From Data to Decision in 3 Simple Steps</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            Get a clear picture of your strategy's health in minutes.
          </p>
        </div>
        <div className="relative max-w-5xl mx-auto">
            <div className="absolute top-8 left-8 h-full w-[calc(100%-4rem)] hidden lg:flex items-start justify-between" aria-hidden="true">
                <div className="w-1/3 border-t-2 border-dashed border-gray-700 mt-8"></div>
                <div className="w-1/3 border-t-2 border-dashed border-gray-700 mt-8"></div>
            </div>
            <div className="grid lg:grid-cols-3 gap-y-16 lg:gap-x-8">
                <Step icon={<UploadIcon className="h-8 w-8 text-primary-400" />} number={1} title="Upload Reports">
                    Securely upload your backtest and real-time reports from MT4/5 or any platform that exports to CSV/TXT.
                </Step>
                <Step icon={<ChartPieIcon className="h-8 w-8 text-primary-400" />} number={2} title="Instant Analysis">
                    Our engine calculates key metrics, runs statistical tests, and visualizes the performance drift between your datasets.
                </Step>
                <Step icon={<CogIcon className="h-8 w-8 text-primary-400" />} number={3} title="Optimize Your Portfolio">
                    Analyze how including or removing a strategy impacts your portfolio's overall statistics. Fine-tune your allocations to build a more robust portfolio.
                </Step>
            </div>
        </div>
      </div>
    </section>
  );
};