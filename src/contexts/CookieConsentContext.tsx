
import React, { createContext, useContext, useState, useEffect } from 'react';

interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface CookieConsentContextType {
  hasConsented: boolean;
  cookieSettings: CookieSettings;
  showBanner: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  updateSettings: (settings: CookieSettings) => void;
  showSettings: () => void;
  hideBanner: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const defaultSettings: CookieSettings = {
  necessary: true, // Always true, cannot be disabled
  analytics: false,
  marketing: false,
  functional: false,
};

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasConsented, setHasConsented] = useState(false);
  const [cookieSettings, setCookieSettings] = useState<CookieSettings>(defaultSettings);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookie-consent');
    const savedSettings = localStorage.getItem('cookie-settings');
    
    if (savedConsent === 'true' && savedSettings) {
      setHasConsented(true);
      setCookieSettings(JSON.parse(savedSettings));
      setShowBanner(false);
    } else {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const saveConsent = (settings: CookieSettings) => {
    localStorage.setItem('cookie-consent', 'true');
    localStorage.setItem('cookie-settings', JSON.stringify(settings));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setHasConsented(true);
    setCookieSettings(settings);
    setShowBanner(false);
    
    // Apply cookie settings
    applyCookieSettings(settings);
  };

  const applyCookieSettings = (settings: CookieSettings) => {
    // Clear existing cookies if disabled
    if (!settings.analytics) {
      // Clear analytics cookies (Google Analytics, etc.)
      document.cookie = '_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = '_ga_=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = '_gid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    if (!settings.marketing) {
      // Clear marketing cookies
      document.cookie = '_fbp=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    console.log('Cookie settings applied:', settings);
  };

  const acceptAll = () => {
    const allAcceptedSettings: CookieSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    saveConsent(allAcceptedSettings);
  };

  const rejectAll = () => {
    saveConsent(defaultSettings);
  };

  const updateSettings = (settings: CookieSettings) => {
    saveConsent({ ...settings, necessary: true });
  };

  const showSettings = () => {
    setShowBanner(true);
  };

  const hideBanner = () => {
    setShowBanner(false);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        hasConsented,
        cookieSettings,
        showBanner,
        acceptAll,
        rejectAll,
        updateSettings,
        showSettings,
        hideBanner,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};
