import { FileText, CreditCard, Truck, Heart, Home, GraduationCap, Shield, Landmark, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const categoryIcons = {
  identity: Shield,
  finance: CreditCard,
  welfare: Heart,
  transport: Truck,
  health: Heart,
  property: Home,
  education: GraduationCap,
  default: FileText,
};

export default function ServiceCard({ service, onClick }) {
  const { language, t } = useLanguage();
  const Icon = categoryIcons[service.category] || categoryIcons.default;

  const name = language === 'hi' ? service.nameHi : service.name;
  const desc = language === 'hi' ? service.descriptionHi : service.description;
  const dept = language === 'hi' ? service.departmentHi : service.department;
  const catLabel = language === 'hi' ? service.categoryLabelHi : service.categoryLabel;

  return (
    <button
      onClick={onClick}
      className="group bg-[#111115] border border-white/10 rounded-2xl p-5 text-left w-full h-full
                 hover:bg-[#1c1c24] hover:border-white/20 hover:-translate-y-1
                 transition-all duration-200 cursor-pointer"
    >
      {/* Category badge */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 mb-4">
        <Icon className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-xs font-medium text-gray-400">{catLabel}</span>
      </div>

      <h3 className="text-base font-semibold text-white mb-2 group-hover:text-gray-200 transition-colors duration-200">
        {name}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-2">
        {desc}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Landmark className="w-3 h-3" />
          {dept}
        </span>
        <span className="text-xs text-gray-400 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {t('viewDetails')}
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </button>
  );
}
