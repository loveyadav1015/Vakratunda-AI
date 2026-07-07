import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, CheckCircle, Clock, UserCheck, CircleDot, AlertCircle, ClipboardList } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const steps = [
  { key: 'submitted', icon: CircleDot },
  { key: 'underReview', icon: Clock },
  { key: 'assigned', icon: UserCheck },
  { key: 'resolved', icon: CheckCircle },
];

export default function StatusTracker() {
  const { t } = useLanguage();
  const location = useLocation();
  const [ticketInput, setTicketInput] = useState(location.state?.ticketId || '');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [searched, setSearched] = useState(false);

  // Auto-search if ticket ID was passed via navigation state
  useEffect(() => {
    if (location.state?.ticketId) {
      handleSearch(null, location.state.ticketId);
    }
  }, [location.state?.ticketId]);

  const handleSearch = (e, overrideId = null) => {
    e?.preventDefault();
    const id = overrideId || ticketInput.trim();
    if (!id) return;

    setSearched(true);
    const issues = JSON.parse(localStorage.getItem('smartBharatIssues') || '[]');
    const found = issues.find(issue => issue.ticketId === id);

    if (found) {
      // Randomly assign a current status stage for demo
      const currentStep = Math.floor(Math.random() * 4);
      setResult({ ...found, currentStep });
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  const stepLabels = [
    t('statusSubmitted'),
    t('statusUnderReview'),
    t('statusAssigned'),
    t('statusResolved'),
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-20 sm:py-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
            <ClipboardList className="w-7 h-7 text-gray-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('trackTitle')}</h1>
          <p className="text-sm text-gray-500">{t('trackSubtitle')}</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <input
            type="text"
            value={ticketInput}
            onChange={(e) => setTicketInput(e.target.value)}
            placeholder={t('trackPlaceholder')}
            className="w-full bg-[#111115] border border-white/10 rounded-xl px-5 py-4 pr-32 text-sm text-white font-mono
                       placeholder:text-gray-500 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-pink-500/50 
                       focus:border-pink-500/50 transition-all duration-200"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 px-5 py-2.5 bg-white 
                       text-black text-sm font-semibold rounded-lg hover:scale-[1.02] transition-all duration-200"
          >
            <Search className="w-4 h-4" />
            {t('trackBtn')}
          </button>
        </form>

        {/* Not found */}
        {notFound && searched && (
          <div className="bg-[#111115] border border-white/10 rounded-2xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-sm text-gray-500">{t('noTicketFound')}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="animate-slide-up">
            {/* Ticket info card */}
            <div className="bg-[#111115] border border-white/10 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('ticketId')}</p>
                  <p className="text-lg font-bold text-pink-500 font-mono">{result.ticketId}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                  result.currentStep === 3
                    ? 'bg-success/10 border border-success/20 text-success'
                    : 'bg-white/5 border border-white/10 text-pink-400'
                }`}>
                  {stepLabels[result.currentStep]}
                </div>
              </div>
              {result.description && (
                <p className="text-sm text-gray-500 border-t border-white/10 pt-4 mt-2">
                  {result.description}
                </p>
              )}
            </div>

            {/* Status Timeline - Horizontal on desktop, vertical on mobile */}
            <div className="bg-[#111115] border border-white/10 rounded-2xl p-6 sm:p-8">
              <h3 className="text-sm font-semibold text-white mb-8">Status Timeline</h3>

              {/* Desktop horizontal stepper */}
              <div className="hidden sm:flex items-start justify-between relative">
                {/* Connector line */}
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-white/10" />
                <div
                  className="absolute top-5 left-5 h-0.5 bg-pink-500 transition-all duration-700"
                  style={{
                    width: `calc(${(result.currentStep / (steps.length - 1)) * 100}% - 40px)`,
                  }}
                />

                {steps.map((step, i) => {
                  const StepIcon = step.icon;
                  const isCompleted = i < result.currentStep;
                  const isCurrent = i === result.currentStep;
                  const isPending = i > result.currentStep;

                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center text-center" style={{ width: '25%' }}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        isCompleted
                          ? 'bg-white border-white text-black'
                          : isCurrent
                            ? 'bg-pink-500 border-pink-500 text-white animate-glow'
                            : 'bg-[#111115] border-white/20 text-gray-500'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <StepIcon className="w-5 h-5" />
                        )}
                      </div>
                      <span className={`mt-3 text-xs font-medium ${
                        isCompleted ? 'text-white' : isCurrent ? 'text-pink-500' : 'text-gray-500'
                      }`}>
                        {stepLabels[i]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Mobile vertical stepper */}
              <div className="sm:hidden space-y-0">
                {steps.map((step, i) => {
                  const StepIcon = step.icon;
                  const isCompleted = i < result.currentStep;
                  const isCurrent = i === result.currentStep;
                  const isLast = i === steps.length - 1;

                  return (
                    <div key={step.key} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-500 ${
                          isCompleted
                            ? 'bg-white border-white text-black'
                            : isCurrent
                              ? 'bg-pink-500 border-pink-500 text-white'
                              : 'bg-[#111115] border-white/20 text-gray-500'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <StepIcon className="w-5 h-5" />
                          )}
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 h-8 ${
                            isCompleted ? 'bg-pink-500' : 'bg-white/10'
                          }`} />
                        )}
                      </div>
                      <div className="pt-2 pb-4">
                        <span className={`text-sm font-medium ${
                          isCompleted ? 'text-white' : isCurrent ? 'text-pink-500' : 'text-gray-500'
                        }`}>
                          {stepLabels[i]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
