import { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, ExternalLink, Link as LinkIcon } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import PromptPills from '../components/PromptPills';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Ask() {
  const { profile } = useAuth();
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [textareaRows, setTextareaRows] = useState(3);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadRecentSearches();
  }, [profile]);

  const loadRecentSearches = () => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  };

  const saveSearch = (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 5) return;

    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    saveSearch(query);
    setLoading(true);
    try {
      const { data } = await supabase
        .from('assets')
        .select('*')
        .limit(10);

      if (data) {
        const recsWithMockData = data.map(asset => ({
          id: Math.random().toString(),
          asset_id: asset.id,
          asset: asset,
          reason: `Matches your query: "${query}"`,
          confidence_score: 0.92,
        }));
        setRecommendations(recsWithMockData);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (assetUrl: string, assetTitle: string) => {
    navigator.clipboard.writeText(assetUrl);
    alert(`Link copied: ${assetTitle}`);
  };

  const handleMoreLikeThis = async (asset: any) => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('assets')
        .select('*')
        .neq('id', asset.id)
        .limit(10);

      if (data) {
        const similar = data.filter(a =>
          a.type === asset.type ||
          a.industry_tags.some((tag: string) => asset.industry_tags.includes(tag)) ||
          a.cloud_tags.some((tag: string) => asset.cloud_tags.includes(tag))
        );

        const recsWithMockData = similar.slice(0, 5).map(a => ({
          id: Math.random().toString(),
          asset_id: a.id,
          asset: a,
          reason: `Similar to ${asset.title} - matches ${a.type === asset.type ? 'type' : 'tags'}`,
          confidence_score: 0.85,
        }));

        setRecommendations(recsWithMockData);
      }
    } catch (error) {
      console.error('Error finding similar assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSearch();
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (newQuery.length === 0) {
      setTextareaRows(3);
    } else {
      const lineCount = newQuery.split('\n').length;
      setTextareaRows(Math.max(lineCount, 3));
    }
  };

  const handlePillClick = (scaffoldText: string, cursorPosition?: number) => {
    setQuery(scaffoldText);

    const lineCount = scaffoldText.split('\n').length;
    setTextareaRows(Math.max(lineCount, 8));

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        if (cursorPosition !== undefined) {
          textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
        } else {
          textareaRef.current.setSelectionRange(scaffoldText.length, scaffoldText.length);
        }
      }
    }, 0);
  };

  return (
    <div className="max-w-4xl mx-auto px-6">
      {recommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="mb-12 text-center">
            <img
              src="/lyzr-logo-cropped.webp"
              alt="Lyzr"
              className="h-24 mx-auto mb-8"
            />
            <h1 className="text-5xl font-bold mb-4">Get the right demo, proof, or answer—fast</h1>
            <p className="text-xl text-gray-600">Paste meeting notes, ask about a deal, or find the best demos, case studies, and playbooks to move it forward.</p>
          </div>

          <div className="w-full max-w-3xl">
            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow" data-tour="ask-input">
              <div className="flex items-start gap-3 p-4">
                <Search className="h-5 w-5 text-gray-400 mt-2 flex-shrink-0" />
                <textarea
                  ref={textareaRef}
                  value={query}
                  onChange={handleQueryChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask anything about your customer, deal, or content..."
                  className="flex-1 resize-y min-h-[72px] bg-transparent border-none outline-none text-base placeholder-gray-400"
                  rows={textareaRows}
                />
                <button
                  onClick={handleSearch}
                  disabled={loading || !query.trim()}
                  className="flex-shrink-0 mt-1 w-10 h-10 rounded-full bg-black hover:bg-gray-800 disabled:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  <ArrowRight className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            <PromptPills onPillClick={handlePillClick} />
          </div>
        </div>
      ) : (
        <div className="py-8">
          <div className="mb-8">
            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-start gap-3 p-4">
                <Search className="h-5 w-5 text-gray-400 mt-2 flex-shrink-0" />
                <textarea
                  ref={textareaRef}
                  value={query}
                  onChange={handleQueryChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask anything about your customer, deal, or content..."
                  className="flex-1 resize-y min-h-[72px] bg-transparent border-none outline-none text-base placeholder-gray-400"
                  rows={textareaRows}
                />
                <button
                  onClick={handleSearch}
                  disabled={loading || !query.trim()}
                  className="flex-shrink-0 mt-1 w-10 h-10 rounded-full bg-black hover:bg-gray-800 disabled:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  <ArrowRight className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            <PromptPills onPillClick={handlePillClick} />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Recommendations</h3>
            {recommendations.map((rec) => (
              <GlassCard key={rec.id} hover>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-black text-white text-xs rounded-full">
                        {rec.asset.type}
                      </span>
                      <span className="text-sm text-gray-600">
                        {Math.round(rec.confidence_score * 100)}% match
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold mb-2">{rec.asset.title}</h4>
                    <p className="text-gray-700 mb-3">{rec.reason}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {rec.asset.industry_tags?.map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleMoreLikeThis(rec.asset)}
                      className="text-sm text-gray-600 hover:text-black underline"
                    >
                      More like this
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {rec.asset.url && (
                      <>
                        <a
                          href={rec.asset.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
                          title="Open"
                        >
                          <ExternalLink className="h-4 w-4 stroke-black" />
                        </a>
                        <button
                          onClick={() => handleCopyLink(rec.asset.url, rec.asset.title)}
                          className="p-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
                          title="Copy link"
                        >
                          <LinkIcon className="h-4 w-4 stroke-black" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
