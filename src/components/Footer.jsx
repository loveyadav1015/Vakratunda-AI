import { Link } from 'react-router-dom';
import { Sparkles, Globe, MessageSquare, Mail, Heart, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0a0a0b] border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{t('footerQuickLinks')}</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: t('navHome') },
                { to: '/chat', label: t('navChat') },
                { to: '/services', label: t('navServices') },
                { to: '/report', label: t('navReport') },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-500 hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{t('footerResources')}</h3>
            <ul className="space-y-2.5">
              {[
                { name: 'Digital India', href: 'https://www.digitalindia.gov.in/' },
                { name: 'India.gov.in', href: 'https://www.india.gov.in/' },
                { name: 'MyGov', href: 'https://www.mygov.in/' },
                { name: 'Data.gov.in', href: 'https://data.gov.in/' }
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    {item.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{t('footerConnect')}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              {t('footerDisclaimer')}
            </p>
            <div className="flex gap-3">
              {[Globe, MessageSquare, Mail].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center
                                           text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#111115] border border-white/10 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-pink-500" />
            </div>
            <span className="text-sm font-semibold text-white">{t('appName')}</span>
          </div>
          <p className="text-xs text-gray-500">
            {t('footerRights')}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-pink-500" /> for Bharat
          </p>
        </div>
      </div>
    </footer>
  );
}