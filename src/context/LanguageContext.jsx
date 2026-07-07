import { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    // Navbar
    navHome: 'Home',
    navChat: 'AI Chat',
    navServices: 'Services',
    navReport: 'Report Issue',
    navTrack: 'Track',
    langToggle: 'हिंदी',
    appName: 'Smart Bharat',

    // Hero
    heroTagline: 'Your AI companion for government services',
    heroSubtext: 'Navigate government schemes, file complaints, and get instant answers — in English or Hindi.',
    heroCta: 'Chat with Companion',
    heroSecondaryCta: 'Explore Services',

    // Quick Access
    quickAccessTitle: 'What would you like to do?',
    findService: 'Find a Service',
    findServiceDesc: 'Browse government services and schemes',
    reportIssue: 'Report an Issue',
    reportIssueDesc: 'File a civic complaint in your area',
    trackComplaint: 'Track Complaint',
    trackComplaintDesc: 'Check the status of your filed issue',
    askQuestion: 'Ask a Question',
    askQuestionDesc: 'Get AI-powered answers instantly',

    // Chat
    chatTitle: 'AI Civic Companion',
    chatSubtitle: 'Ask about government services, schemes, or processes',
    chatPlaceholder: 'Ask about any government service...',
    chatWelcome: 'Namaste! 🙏 I\'m your Smart Bharat AI companion. I can help you with government services, schemes, and civic processes. Ask me anything in English or Hindi!',
    chatSend: 'Send',

    // Services
    servicesTitle: 'Service Directory',
    servicesSubtitle: 'Find information about government services and schemes',
    searchPlaceholder: 'Search services...',
    allCategories: 'All',
    documentsRequired: 'Documents Required',
    department: 'Department',
    askAiAbout: 'Ask AI about this',
    viewDetails: 'View Details',
    close: 'Close',

    // Report
    reportTitle: 'Report a Civic Issue',
    reportSubtitle: 'Help improve your community by reporting problems',
    issueCategory: 'Issue Category',
    selectCategory: 'Select a category',
    catRoads: 'Roads & Potholes',
    catWater: 'Water Supply',
    catElectricity: 'Electricity',
    catSanitation: 'Sanitation & Waste',
    catPublicSafety: 'Public Safety',
    catOther: 'Other',
    issueDescription: 'Description',
    descriptionPlaceholder: 'Describe the issue in detail...',
    issueLocation: 'Location',
    locationPlaceholder: 'Enter the location of the issue...',
    submitReport: 'Submit Report',
    reportSuccess: 'Issue Reported Successfully!',
    reportSuccessMsg: 'Your complaint has been registered. Please save your ticket ID for tracking.',
    ticketId: 'Ticket ID',
    reportAnother: 'Report Another Issue',
    goToTrack: 'Track This Complaint',

    // Track
    trackTitle: 'Track Your Complaint',
    trackSubtitle: 'Enter your ticket ID to check the current status',
    trackPlaceholder: 'Enter ticket ID (e.g., CIV-2026-0431)',
    trackBtn: 'Track Status',
    statusSubmitted: 'Submitted',
    statusUnderReview: 'Under Review',
    statusAssigned: 'Assigned',
    statusResolved: 'Resolved',
    noTicketFound: 'No complaint found with this ticket ID. Please check the ID and try again.',

    // Footer
    footerTagline: 'Empowering citizens with AI-powered civic assistance.',
    footerQuickLinks: 'Quick Links',
    footerResources: 'Resources',
    footerConnect: 'Connect',
    footerRights: '© 2026 Smart Bharat. Built for Digital India.',
    footerDisclaimer: 'This is a hackathon demo project. Not affiliated with any government body.',
  },
  hi: {
    navHome: 'होम',
    navChat: 'AI चैट',
    navServices: 'सेवाएं',
    navReport: 'शिकायत दर्ज करें',
    navTrack: 'ट्रैक करें',
    langToggle: 'English',
    appName: 'स्मार्ट भारत',

    heroTagline: 'सरकारी सेवाओं के लिए आपका AI साथी',
    heroSubtext: 'सरकारी योजनाओं को समझें, शिकायत दर्ज करें, और तुरंत जवाब पाएं — हिंदी या English में।',
    heroCta: 'AI से बात करें',
    heroSecondaryCta: 'सेवाएं देखें',

    quickAccessTitle: 'आप क्या करना चाहेंगे?',
    findService: 'सेवा खोजें',
    findServiceDesc: 'सरकारी सेवाओं और योजनाओं को ब्राउज़ करें',
    reportIssue: 'समस्या रिपोर्ट करें',
    reportIssueDesc: 'अपने क्षेत्र में नागरिक शिकायत दर्ज करें',
    trackComplaint: 'शिकायत ट्रैक करें',
    trackComplaintDesc: 'दर्ज शिकायत की स्थिति जांचें',
    askQuestion: 'सवाल पूछें',
    askQuestionDesc: 'AI से तुरंत जवाब पाएं',

    chatTitle: 'AI नागरिक सहायक',
    chatSubtitle: 'सरकारी सेवाओं, योजनाओं, या प्रक्रियाओं के बारे में पूछें',
    chatPlaceholder: 'किसी भी सरकारी सेवा के बारे में पूछें...',
    chatWelcome: 'नमस्ते! 🙏 मैं आपका स्मार्ट भारत AI साथी हूँ। मैं आपकी सरकारी सेवाओं, योजनाओं और नागरिक प्रक्रियाओं में मदद कर सकता हूँ। हिंदी या English में कुछ भी पूछें!',
    chatSend: 'भेजें',

    servicesTitle: 'सेवा निर्देशिका',
    servicesSubtitle: 'सरकारी सेवाओं और योजनाओं की जानकारी प्राप्त करें',
    searchPlaceholder: 'सेवाएं खोजें...',
    allCategories: 'सभी',
    documentsRequired: 'आवश्यक दस्तावेज़',
    department: 'विभाग',
    askAiAbout: 'AI से पूछें',
    viewDetails: 'विवरण देखें',
    close: 'बंद करें',

    reportTitle: 'नागरिक समस्या रिपोर्ट करें',
    reportSubtitle: 'समस्याओं की रिपोर्ट करके अपने समुदाय को बेहतर बनाएं',
    issueCategory: 'समस्या श्रेणी',
    selectCategory: 'श्रेणी चुनें',
    catRoads: 'सड़कें और गड्ढे',
    catWater: 'जल आपूर्ति',
    catElectricity: 'बिजली',
    catSanitation: 'स्वच्छता और कचरा',
    catPublicSafety: 'सार्वजनिक सुरक्षा',
    catOther: 'अन्य',
    issueDescription: 'विवरण',
    descriptionPlaceholder: 'समस्या का विस्तार से वर्णन करें...',
    issueLocation: 'स्थान',
    locationPlaceholder: 'समस्या का स्थान दर्ज करें...',
    submitReport: 'रिपोर्ट जमा करें',
    reportSuccess: 'समस्या सफलतापूर्वक रिपोर्ट की गई!',
    reportSuccessMsg: 'आपकी शिकायत दर्ज हो गई है। कृपया ट्रैकिंग के लिए अपनी टिकट आईडी सेव करें।',
    ticketId: 'टिकट आईडी',
    reportAnother: 'एक और समस्या रिपोर्ट करें',
    goToTrack: 'शिकायत ट्रैक करें',

    trackTitle: 'अपनी शिकायत ट्रैक करें',
    trackSubtitle: 'वर्तमान स्थिति जानने के लिए अपनी टिकट आईडी दर्ज करें',
    trackPlaceholder: 'टिकट आईडी दर्ज करें (जैसे, CIV-2026-0431)',
    trackBtn: 'स्थिति जांचें',
    statusSubmitted: 'दर्ज की गई',
    statusUnderReview: 'समीक्षा में',
    statusAssigned: 'सौंपी गई',
    statusResolved: 'हल की गई',
    noTicketFound: 'इस टिकट आईडी से कोई शिकायत नहीं मिली। कृपया आईडी जांचें और पुनः प्रयास करें।',

    footerTagline: 'AI-संचालित नागरिक सहायता से नागरिकों को सशक्त बनाना।',
    footerQuickLinks: 'त्वरित लिंक',
    footerResources: 'संसाधन',
    footerConnect: 'जुड़ें',
    footerRights: '© 2026 स्मार्ट भारत। डिजिटल इंडिया के लिए बनाया गया।',
    footerDisclaimer: 'यह एक हैकाथॉन डेमो प्रोजेक्ट है। किसी सरकारी निकाय से संबद्ध नहीं।',
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  const t = (key) => translations[language]?.[key] || translations.en[key] || key;

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
