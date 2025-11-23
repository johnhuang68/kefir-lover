import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../constants/translations';

type TextSize = 'sm' | 'md' | 'lg' | 'xl';
type Language = 'en' | 'th';

interface ThemeContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [textSize, setTextSizeState] = useState<TextSize>('md');
  const [notificationsEnabled, setNotificationsEnabledState] = useState<boolean>(false);
  const [language, setLanguageState] = useState<Language>('en');

  // Initialize from local storage
  useEffect(() => {
    // Text Size
    const savedSize = localStorage.getItem('kefir_text_size') as TextSize;
    if (savedSize) setTextSizeState(savedSize);

    // Notifications
    const savedNotifs = localStorage.getItem('kefir_notifications');
    if (savedNotifs !== null) {
      setNotificationsEnabledState(savedNotifs === 'true');
    }

    // Language
    const savedLang = localStorage.getItem('kefir_language') as Language;
    if (savedLang) setLanguageState(savedLang);
  }, []);

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    localStorage.setItem('kefir_text_size', size);
  };

  const setNotificationsEnabled = (enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    localStorage.setItem('kefir_notifications', String(enabled));
    
    if (enabled && 'Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kefir_language', lang);
  };

  // Helper to get nested translation keys (e.g., 'nav.home')
  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = translations[language];
    
    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`Translation missing for key: ${path} in language: ${language}`);
        return path;
      }
      current = current[key];
    }
    return current;
  };

  // Apply font size to root html element
  useEffect(() => {
    const root = document.documentElement;
    switch (textSize) {
      case 'sm': root.style.fontSize = '14px'; break;
      case 'md': root.style.fontSize = '16px'; break;
      case 'lg': root.style.fontSize = '18px'; break;
      case 'xl': root.style.fontSize = '20px'; break;
      default: root.style.fontSize = '16px';
    }
  }, [textSize]);

  // Apply font family based on language (Thai needs Prompt)
  useEffect(() => {
    document.body.style.fontFamily = language === 'th' 
      ? '"Prompt", "Quicksand", sans-serif' 
      : '"Quicksand", sans-serif';
  }, [language]);

  return (
    <ThemeContext.Provider value={{ 
      textSize, setTextSize, 
      notificationsEnabled, setNotificationsEnabled,
      language, setLanguage,
      t
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};