import { Link } from 'react-router-dom';
import { ArrowRight, Search, AlertTriangle, ClipboardList, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  const quickCards = [
    {
      icon: Search,
      title: t('findService'),
      desc: t('findServiceDesc'),
      to: '/services',
    },
    {
      icon: AlertTriangle,
      title: t('reportIssue'),
      desc: t('reportIssueDesc'),
      to: '/report',
    },
    {
      icon: ClipboardList,
      title: t('trackComplaint'),
      desc: t('trackComplaintDesc'),
      to: '/track',
    },
    {
      icon: MessageCircle,
      title: t('askQuestion'),
      desc: t('askQuestionDesc'),
      to: '/chat',
    },
  ];

  return (
    <div className="relative">
      {/* Background — subtle dark radial gradient only */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-pink-400 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse" />
          AI-Powered Civic Assistant
        </div>

        {/* Heading */}
        <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight mb-4">
          {t('appName')}
        </h1>

        {/* Tagline */}
        <p className="text-xl text-[#e5e5e5] mb-3">
          {t('heroTagline')}
        </p>

        {/* Description */}
        <p className="text-base text-gray-500 max-w-xl mx-auto mb-10">
          {t('heroSubtext')}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black
                       font-semibold rounded-xl hover:bg-gray-100
                       transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5" />
            {t('heroCta')}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white
                       font-medium rounded-xl hover:bg-white/5
                       transition-all duration-200"
          >
            {t('heroSecondaryCta')}
          </Link>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <h2 className="text-2xl font-semibold text-white mb-8 text-center">
          {t('quickAccessTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {quickCards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="group bg-[#111115] border border-white/10 rounded-2xl p-6 h-full
                         hover:bg-[#1c1c24] hover:border-white/20 hover:-translate-y-1
                         transition-all duration-200 cursor-pointer"
            >
              <div className="bg-white/5 p-3 rounded-xl w-fit mb-4">
                <card.icon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-200" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
