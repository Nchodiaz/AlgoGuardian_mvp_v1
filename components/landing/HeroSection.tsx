
import React from 'react';

interface HeroSectionProps {
  onGetStartedClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStartedClick }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28 text-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900"></div>
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-gradient-radial from-primary-800/30 to-transparent blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-gradient-radial from-blue-800/20 to-transparent blur-3xl animate-pulse-slow-delay"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tighter">
            Is Your Strategy Silently Drifting?
            <br />
            <span className="text-primary-400">Find Out Before It's Too Late.</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
            Don't let market changes erode your edge. AlgoGuardian's real-time statistical analysis detects performance decay, protecting your capital and preserving your profits.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={onGetStartedClick}
            className="w-full sm:w-auto px-8 py-3 text-lg font-semibold rounded-md bg-primary-600 hover:bg-primary-700 text-white transition-transform transform hover:scale-105 shadow-2xl shadow-primary-500/20"
          >
            Get Started for Free
          </button>
        </div>
         <div className="mt-20">
            <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Trusted by algorithmic traders worldwide</p>
            <div className="mt-6 flex justify-center items-center space-x-8 opacity-60">
                <p className="text-xl font-bold text-gray-500 italic">QuantFund</p>
                <p className="text-xl font-bold text-gray-500 italic">Vertex Capital</p>
                <p className="text-xl font-bold text-gray-500 italic">Momentum Labs</p>
                <p className="text-xl font-bold text-gray-500 italic hidden sm:block">Apex Traders</p>
                <p className="text-xl font-bold text-gray-500 italic hidden lg:block">SignalStack</p>
            </div>
        </div>
      </div>
       <style>{`
          @keyframes pulse-slow {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
          }
          .animate-pulse-slow {
            animation: pulse-slow 10s infinite ease-in-out;
          }
          .animate-pulse-slow-delay {
            animation: pulse-slow 10s infinite ease-in-out 3s;
          }
          .bg-gradient-radial {
            background-image: radial-gradient(circle, var(--tw-gradient-stops));
          }
      `}</style>
    </section>
  );
};
