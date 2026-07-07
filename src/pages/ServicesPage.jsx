import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ServiceCard from '../components/ServiceCard';
import ServiceModal from '../components/ServiceModal';
import servicesData from '../data/services.json';
import Footer from '../components/Footer';

const categories = [
  { value: 'all', labelEn: 'All', labelHi: 'सभी' },
  { value: 'identity', labelEn: 'Identity', labelHi: 'पहचान' },
  { value: 'finance', labelEn: 'Finance', labelHi: 'वित्त' },
  { value: 'welfare', labelEn: 'Welfare', labelHi: 'कल्याण' },
  { value: 'transport', labelEn: 'Transport', labelHi: 'परिवहन' },
  { value: 'health', labelEn: 'Health', labelHi: 'स्वास्थ्य' },
  { value: 'property', labelEn: 'Property', labelHi: 'संपत्ति' },
  { value: 'education', labelEn: 'Education', labelHi: 'शिक्षा' },
];

export default function ServicesPage() {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedService, setSelectedService] = useState(null);

  const filtered = useMemo(() => {
    return servicesData.filter((svc) => {
      const matchesCategory = activeCategory === 'all' || svc.category === activeCategory;
      const searchTerm = search.toLowerCase();
      const matchesSearch = !search ||
        svc.name.toLowerCase().includes(searchTerm) ||
        svc.nameHi.includes(search) ||
        svc.description.toLowerCase().includes(searchTerm) ||
        svc.department.toLowerCase().includes(searchTerm);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
            <SlidersHorizontal className="w-7 h-7 text-gray-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('servicesTitle')}</h1>
          <p className="text-sm text-gray-500">{t('servicesSubtitle')}</p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-[#111115] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white
                       placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 
                       focus:border-pink-500/50 transition-all duration-200"
          />
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.value
                  ? 'bg-white text-black'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {language === 'hi' ? cat.labelHi : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((svc) => (
            <div key={svc.id}>
              <ServiceCard service={svc} onClick={() => setSelectedService(svc)} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No services found matching your search.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedService && (
        <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
      )}

      <Footer />
    </div>
  );
}
