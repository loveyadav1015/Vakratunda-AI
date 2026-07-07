import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, MapPin, FileText, CheckCircle, Send, RotateCcw, ClipboardList, Copy, Check, Camera, X, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { analyzeImage } from '../utils/geminiApi';

export default function ComplaintForm() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    location: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [copied, setCopied] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imageAnalyzed, setImageAnalyzed] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageAnalyzed(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    setImageAnalyzed(false);
  };

  const categories = [
    { value: 'roads', label: t('catRoads') },
    { value: 'water', label: t('catWater') },
    { value: 'electricity', label: t('catElectricity') },
    { value: 'sanitation', label: t('catSanitation') },
    { value: 'safety', label: t('catPublicSafety') },
    { value: 'other', label: t('catOther') },
  ];

  const generateTicketId = () => {
    const year = new Date().getFullYear();
    const num = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
    return `CIV-${year}-${num}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.location) return;

    if (imageFile && !imageAnalyzed) {
      setIsAnalyzing(true);
      try {
        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
        const desc = await analyzeImage(base64Data, imageFile.type);
        setFormData(prev => ({ ...prev, description: desc }));
        setImageAnalyzed(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
      return;
    }

    if (!formData.description) return;

    const newTicketId = generateTicketId();
    setTicketId(newTicketId);

    // Store in localStorage
    const issues = JSON.parse(localStorage.getItem('smartBharatIssues') || '[]');
    issues.push({
      ticketId: newTicketId,
      ...formData,
      status: 0, // 0: Submitted
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('smartBharatIssues', JSON.stringify(issues));

    setSubmitted(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setFormData({ category: '', description: '', location: '' });
    setSubmitted(false);
    setTicketId('');
    clearImage();
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center animate-slide-up">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">{t('reportSuccess')}</h2>
          <p className="text-sm text-gray-500 mb-8">{t('reportSuccessMsg')}</p>

          {/* Ticket ID Card */}
          <div className="bg-[#111115] border border-white/10 rounded-2xl p-6 mb-8">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{t('ticketId')}</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold text-pink-500 tracking-wide font-mono">{ticketId}</span>
              <button
                onClick={handleCopy}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center
                           text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleReset}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 border border-white/20 
                         text-white font-medium rounded-xl hover:bg-white/5 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              {t('reportAnother')}
            </button>
            <button
              onClick={() => navigate('/track', { state: { ticketId } })}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-black 
                         font-semibold rounded-xl hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
            >
              <ClipboardList className="w-4 h-4" />
              {t('goToTrack')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-20 sm:py-24">
      <div className="max-w-lg w-full animate-slide-up">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-7 h-7 text-gray-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('reportTitle')}</h1>
          <p className="text-sm text-gray-500">{t('reportSubtitle')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#111115] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">{t('issueCategory')}</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full bg-[#0d0d0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white
                         focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200"
              required
            >
              <option value="" disabled className="bg-[#0d0d0f] text-gray-500">{t('selectCategory')}</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-[#0d0d0f]">{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              <FileText className="w-4 h-4 inline mr-1.5 text-gray-500" />
              {t('issueDescription')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t('descriptionPlaceholder')}
              rows={4}
              className="w-full bg-[#0d0d0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white
                         placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 
                         focus:border-pink-500/50 transition-all duration-200 resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              <Camera className="w-4 h-4 inline mr-1.5 text-gray-500" />
              Upload Image (Optional)
            </label>
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl hover:border-pink-500/50 hover:bg-[#111115] transition-all cursor-pointer bg-[#0d0d0f]">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className="w-8 h-8 text-gray-500 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload image</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            ) : (
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              <MapPin className="w-4 h-4 inline mr-1.5 text-gray-500" />
              {t('issueLocation')}
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder={t('locationPlaceholder')}
              className="w-full bg-[#0d0d0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white
                         placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 
                         focus:border-pink-500/50 transition-all duration-200"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-black 
                       font-semibold rounded-xl hover:scale-[1.02] hover:shadow-lg transition-all duration-200 mt-2
                       disabled:opacity-70 disabled:hover:scale-100"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Image...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {imageFile && !imageAnalyzed ? "Analyze Image & Continue" : t('submitReport')}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
