import React, { useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Icon from './AppIcon';


export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const currentTheme = themes?.find(t => t?.value === theme) || themes?.[2];
  const CurrentIcon = currentTheme?.icon;

  const handleThemeSelect = (value) => {
    toggleTheme(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-t2 hover:bg-bg1 hover:text-t1 rounded-lg"
        aria-label="Toggle theme"
      >
        <CurrentIcon size={20} />
        <span className="hidden lg:inline">{currentTheme?.label}</span>
      </button>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-bg2 border border-bd rounded z-50 overflow-hidden">
            {themes?.map((themeOption) => {
              const Icon = themeOption?.icon;
              return (
                <button
                  key={themeOption?.value}
                  onClick={() => handleThemeSelect(themeOption?.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    theme === themeOption?.value
                      ? 'bg-accent text-accent-foreground' :'text-t2 hover:bg-bg1 hover:text-t1'
                  }`}
                >
                  <Icon size={18} />
                  <span>{themeOption?.label}</span>
                  {theme === themeOption?.value && (
                    <span className="ml-auto text-xs">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}