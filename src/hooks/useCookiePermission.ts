
import { useCookieConsent } from '@/contexts/CookieConsentContext';

export const useCookiePermission = () => {
  const { cookieSettings, hasConsented } = useCookieConsent();

  const canUseAnalytics = () => {
    return hasConsented && cookieSettings.analytics;
  };

  const canUseMarketing = () => {
    return hasConsented && cookieSettings.marketing;
  };

  const canUseFunctional = () => {
    return hasConsented && cookieSettings.functional;
  };

  const canUseNecessary = () => {
    return cookieSettings.necessary; // Always true
  };

  return {
    canUseAnalytics,
    canUseMarketing,
    canUseFunctional,
    canUseNecessary,
    hasConsented,
    cookieSettings,
  };
};
