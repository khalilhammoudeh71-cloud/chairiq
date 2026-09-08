import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { trackEvent } from '../../utils/analytics';


const LanguageToggle = ({ className = '' }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('chairiq-language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'es' : 'en';
    setCurrentLanguage(newLanguage);
    localStorage.setItem('chairiq-language', newLanguage);
    trackEvent('language_changed', {
      language: newLanguage,
      location: 'global_toggle',
    });
    
    const event = new CustomEvent('languageChange', { detail: { language: newLanguage } });
    window.dispatchEvent(event);
  };

  return (
    <div className={`language-toggle ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguage}
        iconName="Languages"
        iconPosition="left"
        iconSize={18}
        className="transition-smooth hover:bg-muted"
        aria-label={`Switch to ${currentLanguage === 'en' ? 'Spanish' : 'English'}`}
      >
        <span className="font-medium">
          {currentLanguage === 'en' ? 'EN' : 'ES'}
        </span>
      </Button>
    </div>
  );
};

export default LanguageToggle;