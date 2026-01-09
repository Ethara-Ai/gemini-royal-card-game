import React, { createContext, useContext, useEffect, useState } from 'react';
import { RuleSet } from '../lib/types';

interface Settings {
  playerName: string;
  theme: 'dark' | 'light';
  cardBack: string; // Hex color
  cardPattern: 'solid' | 'checkerboard' | 'diagonal' | 'dots';
  reducedMotion: boolean;
  preferredRuleSet: RuleSet;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  playerName: 'Player',
  theme: 'dark',
  cardBack: '#1e3a8a', // Blue
  cardPattern: 'solid',
  reducedMotion: false,
  preferredRuleSet: 'suit-follows',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('gemini-royal-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('gemini-royal-settings', JSON.stringify(settings));
    
    // Apply theme
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

