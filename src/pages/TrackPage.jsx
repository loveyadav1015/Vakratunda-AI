import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Clock, CheckCircle2, AlertCircle, FileText, MapPin } from 'lucide-react';

export default function TrackPage() {
  const location = useLocation();
  const [searchId, setSearchId] = useState('');
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState('');

  // Auto-fill and search if navigating from the report page
  useEffect(() => {
    if (location.state?.ticketId) {
      setSearchId(location.state.ticketId);
      handleSearch(location.state.ticketId);
    }
  }, [location.state]);

  const handleSearch = (idToSearch = searchId) => {
    if (!idToSearch.trim()) return;
    
    setError('');
    const issues = JSON.parse(localStorage.getItem('smartBharatIssues') || '[]');
    const foundTicket = issues.find(issue => issue.ticketId === idToSearch.trim());

    if (foundTicket) {
      setTicketData(foundTicket);
    } else {
      setTicketData(null);
      setError('No complaint found with this Ticket ID. Please check and try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">Track Your Complaint</h1>
        <p className="text-gray-400 text-sm md:text-base">
          Enter your Vakratunda AI Ticket ID to check the real-time status of your civic issue.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3 mb-10">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g., CIV-2026-0492"
            className="w-full bg-[#111115] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-pink-500 transition-colors uppercase"
          />
        </div>
        <button
          onClick={() => handleSearch()}
          className="px-6 py-4 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-xl transition-colors"
        >
          Track Status
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Ticket Details Card */}
      {ticketData && (
        <div className="bg-[#111115] border border-white/10 rounded-2xl p-6 sm:p-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 mb-6 gap-4">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Ticket ID</p>
              <h2 className="text-2xl font-bold text-pink-500 font-mono">{ticketData.ticketId}</h2>
            </div>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-sm font-medium w-max">
              <Clock className="w-4 h-4" />
              Processing
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-white font-medium mb-2">
                <FileText className="w-4 h-4 text-gray-400" />
                Issue Description
              </div>
              <p className="text-gray-400 text-sm leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5">
                {ticketData.description}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-white font-medium mb-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                Location
              </div>
              <p className="text-gray-400 text-sm bg-black/30 p-4 rounded-xl border border-white/5">
                {ticketData.location}
              </p>
            </div>
            
            <div className="pt-6 border-t border-white/10">
              <p className="text-xs text-gray-500 text-center">
                Reported on: {new Date(ticketData.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}