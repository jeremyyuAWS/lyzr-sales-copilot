import { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import WelcomeModal from './WelcomeModal';
import ProductTour from './ProductTour';

type LayoutProps = {
  children: ReactNode;
  title: string;
  currentPage: string;
  onNavigate: (page: string) => void;
};

export default function Layout({ children, title, currentPage, onNavigate }: LayoutProps) {
  const [showWelcome, setShowWelcome] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('hasSeenWelcome');
    if (!seen) {
      setShowWelcome(true);
    }
    setHasSeenWelcome(!!seen);
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWelcome', 'true');
    setHasSeenWelcome(true);
  };

  const handleStartTour = () => {
    setRunTour(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} onHelpClick={() => setShowWelcome(true)} />

        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>

      <WelcomeModal
        isOpen={showWelcome}
        onClose={handleCloseWelcome}
        onStartTour={handleStartTour}
      />

      <ProductTour run={runTour} onComplete={() => setRunTour(false)} />
    </div>
  );
}
