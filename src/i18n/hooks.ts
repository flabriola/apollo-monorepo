import { useTranslation } from 'react-i18next';

// Custom hook for translations with better TypeScript support
export const useAppTranslation = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const getAvailableLanguages = () => {
    return Object.keys(i18n.options.resources || {});
  };

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    isReady: i18n.isInitialized,
  };
};

// Language options for dropdowns/selectors
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  // Add more languages here as you expand
  // { code: 'es', name: 'Spanish', nativeName: 'Español' },
  // { code: 'fr', name: 'French', nativeName: 'Français' },
  // { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
];

// Helper function to get language name
export const getLanguageName = (code: string): string => {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  return language?.name || code;
};

// Helper function to get native language name
export const getNativeLanguageName = (code: string): string => {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  return language?.nativeName || code;
}; 