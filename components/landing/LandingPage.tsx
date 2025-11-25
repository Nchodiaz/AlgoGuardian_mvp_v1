import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { HowItWorksSection } from './HowItWorksSection';
import { PricingSection } from './PricingSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FAQSection } from './FAQSection';
import { CtaSection } from './CtaSection';
import { LandingFooter } from './LandingFooter';
import { LegalLayout } from './legal/LegalLayout';
import { LegalPages } from './legal/LegalPages';

interface LandingPageProps {
    onAuthClick: (view: 'login' | 'signup', plan?: string, isPotentialLead?: boolean) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAuthClick }) => {
    const [view, setView] = useState<'home' | 'legal'>('home');
    const [legalPage, setLegalPage] = useState('privacy-policy');
    const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);

    // Scroll to top when view changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [view, legalPage]);

    const handleLegalClick = (page: string) => {
        setLegalPage(page);
        setView('legal');
    };

    const handleBackToHome = () => {
        setView('home');
    };

    if (view === 'legal') {
        return (
            <LegalLayout
                activePage={legalPage}
                onNavigate={setLegalPage}
                onBackToHome={handleBackToHome}
            >
                <LegalPages page={legalPage} />
            </LegalLayout>
        );
    }

    return (
        <div className="bg-gray-900">
            <LandingHeader onAuthClick={onAuthClick} />
            <main>
                <HeroSection onGetStartedClick={() => onAuthClick('signup')} />
                <FeaturesSection />
                <HowItWorksSection />
                <PricingSection onPlanSelect={(plan) => {
                    if (plan === 'premium') {
                        setIsComingSoonModalOpen(true);
                    } else {
                        onAuthClick('signup', plan);
                    }
                }} />
                <TestimonialsSection />
                <FAQSection />
                <CtaSection onGetStartedClick={() => onAuthClick('signup')} />
            </main>
            <LandingFooter onLegalClick={handleLegalClick} />
            <Modal
                isOpen={isComingSoonModalOpen}
                onClose={() => setIsComingSoonModalOpen(false)}
                title="Coming Soon"
            >
                <div className="text-gray-300">
                    <p className="mb-4">
                        The Premium plan is currently open to <span className="text-primary-400 font-semibold">internal beta testers only</span>.
                    </p>
                    <p className="mb-4">
                        We have added you to our <span className="text-white font-semibold">priority waiting list</span>.
                        In the meantime, you can create a Free account to get started immediately!
                    </p>
                    <div className="flex justify-end mt-6 space-x-3">
                        <button
                            onClick={() => setIsComingSoonModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-500 text-white"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                setIsComingSoonModalOpen(false);
                                onAuthClick('signup', 'free', true);
                            }}
                            className="px-4 py-2 text-sm font-medium rounded-md bg-primary-600 hover:bg-primary-700 text-white"
                        >
                            Create Free Account
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
