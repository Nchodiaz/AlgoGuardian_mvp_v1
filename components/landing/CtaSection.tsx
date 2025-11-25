
import React from 'react';

interface CtaSectionProps {
  onGetStartedClick: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onGetStartedClick }) => {
  return (
    <section className="py-20 lg:py-24 bg-gray-800/50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-white">
          Stop Guessing. Start Guarding Your Algorithms.
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
          Your strategies are too valuable to leave to chance. Sign up for free and get your first drift analysis in minutes.
        </p>
        <div className="mt-8">
          <button 
            onClick={onGetStartedClick}
            className="px-8 py-3 text-lg font-semibold rounded-md bg-primary-600 hover:bg-primary-700 text-white transition-transform transform hover:scale-105 shadow-2xl shadow-primary-500/20"
          >
            Get Started for Free
          </button>
        </div>
      </div>
    </section>
  );
};
