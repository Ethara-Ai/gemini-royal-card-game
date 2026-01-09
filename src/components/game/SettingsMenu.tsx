import { useState } from 'react';
import { BsList, BsMoonFill, BsSunFill, BsQuestionCircle, BsPalette } from 'react-icons/bs';
import { useSettings } from '../../contexts/SettingsContext';
import { Modal } from '../ui/Modal';
import { HowToPlay } from './HowToPlay';
import { HexColorPicker } from 'react-colorful';
import { CARD_BACK_PATTERNS } from '../../lib/constants';
import clsx from 'clsx';

export const SettingsMenu = () => {
  const { settings, updateSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur transition-all"
        aria-label="Menu"
      >
        <BsList size={24} />
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Game Menu">
        <div className="space-y-4">
          <button 
            onClick={() => { setIsOpen(false); setShowRules(true); }}
            className="w-full flex items-center gap-3 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors text-left"
          >
            <BsQuestionCircle size={20} className="text-casino-gold" />
            <span className="font-bold">How to Play</span>
          </button>

          <button 
            onClick={() => { setIsOpen(false); setShowAppearance(true); }}
            className="w-full flex items-center gap-3 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors text-left"
          >
            <BsPalette size={20} className="text-casino-gold" />
            <span className="font-bold">Appearance</span>
          </button>

          <button 
            onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
            className="w-full flex items-center gap-3 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors text-left"
          >
            {settings.theme === 'dark' ? <BsSunFill size={20} className="text-casino-gold" /> : <BsMoonFill size={20} className="text-casino-gold" />}
            <span className="font-bold">Switch to {settings.theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>
      </Modal>

      <Modal isOpen={showRules} onClose={() => setShowRules(false)} title="How to Play">
        <HowToPlay />
      </Modal>

      <Modal isOpen={showAppearance} onClose={() => setShowAppearance(false)} title="Customize Cards">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">Card Back Color</label>
            <div className="flex justify-center">
               <HexColorPicker color={settings.cardBack} onChange={(color) => updateSettings({ cardBack: color })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Pattern</label>
            <div className="grid grid-cols-2 gap-3">
              {CARD_BACK_PATTERNS.map((pattern) => (
                <button
                  key={pattern}
                  onClick={() => updateSettings({ cardPattern: pattern as any })}
                  className={clsx(
                    "p-3 rounded-lg border text-sm capitalize",
                    settings.cardPattern === pattern 
                      ? "border-casino-gold bg-casino-blue" 
                      : "border-gray-700 bg-gray-800 hover:bg-gray-700"
                  )}
                >
                  {pattern.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

