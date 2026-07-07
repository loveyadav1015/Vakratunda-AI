import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, FileText, Landmark, MessageCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ServiceModal({ service, onClose }) {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const name = language === 'hi' ? service.nameHi : service.name;
  const desc = language === 'hi' ? service.descriptionHi : service.description;
  const dept = language === 'hi' ? service.departmentHi : service.department;
  const docs = language === 'hi' ? service.documentsRequiredHi : service.documentsRequired;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleAskAi = () => {
    const question = language === 'hi'
      ? `मुझे ${service.nameHi} के बारे में विस्तार से बताएं। आवेदन कैसे करें, पात्रता, और प्रक्रिया क्या है?`
      : `Tell me about ${service.name} in detail. How do I apply, what is the eligibility, and what's the process?`;
    onClose();
    navigate('/chat', { state: { initialMessage: question } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#111115] border border-white/10 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center
                     text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header gradient */}
        <div className="relative px-6 pt-6 pb-4">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-t-2xl" />
          <div className="relative">
            <h2 className="text-xl font-bold text-white pr-8 mb-2">{name}</h2>
            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
              <Landmark className="w-4 h-4" />
              {dept}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-5">
          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>

          {/* Documents */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              {t('documentsRequired')}
            </h3>
            <ul className="space-y-2">
              {docs.map((doc, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
                  <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAskAi}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-black 
                         font-semibold rounded-xl hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              {t('askAiAbout')}
            </button>
            <button
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 border border-white/20 
                         text-white font-medium rounded-xl hover:bg-white/5 transition-all duration-200"
            >
              {t('close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
