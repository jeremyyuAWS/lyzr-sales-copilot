import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Ask from './pages/Ask';
import Deals from './pages/Deals';
import DealDetail from './pages/DealDetail';
import Conversations from './pages/Conversations';
import ContentLibrary from './pages/ContentLibrary';
import Integrations from './pages/Integrations';

type Page = 'ask' | 'deals' | 'deal-detail' | 'conversations' | 'content' | 'integrations';

function App() {
  const { loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('ask');
  const [selectedDealId, setSelectedDealId] = useState<string>('');

  const handleNavigate = (page: string, dealId?: string) => {
    setCurrentPage(page as Page);
    if (dealId) setSelectedDealId(dealId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const pageTitles: Record<Page, string> = {
    ask: 'Sales Workspace',
    deals: 'Deals Pipeline',
    'deal-detail': 'Deal Details',
    conversations: 'Conversations',
    content: 'Content Library',
    integrations: 'Integrations',
  };

  return (
    <Layout
      title={pageTitles[currentPage]}
      currentPage={currentPage}
      onNavigate={handleNavigate}
    >
      {currentPage === 'ask' && <Ask />}
      {currentPage === 'deals' && <Deals onNavigate={handleNavigate} />}
      {currentPage === 'deal-detail' && <DealDetail dealId={selectedDealId} onNavigate={handleNavigate} />}
      {currentPage === 'conversations' && <Conversations />}
      {currentPage === 'content' && <ContentLibrary />}
      {currentPage === 'integrations' && <Integrations />}
    </Layout>
  );
}

export default App;
