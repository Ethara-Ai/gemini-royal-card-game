import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { RuleSet } from '../../lib/types';
import { motion } from 'framer-motion';
import { BsSuitSpadeFill, BsQuestionCircle } from 'react-icons/bs';
import { Modal } from '../ui/Modal';
import { HowToPlay } from '../game/HowToPlay';

interface LobbyProps {
  onStart: (name: string, ruleSet: RuleSet) => void;
}

export const Lobby: React.FC<LobbyProps> = ({ onStart }) => {
  const { settings, updateSettings } = useSettings();
  const [name, setName] = useState(settings.playerName);
  const [ruleSet, setRuleSet] = useState<RuleSet>(settings.preferredRuleSet);
  const [showRules, setShowRules] = useState(false);

  const handleStart = () => {
    if (name.trim()) {
      updateSettings({ playerName: name, preferredRuleSet: ruleSet });
      onStart(name, ruleSet);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-white/10"
      >
        <div className="flex justify-center mb-8">
           <div className="w-20 h-20 bg-casino-gold rounded-full flex items-center justify-center text-gray-900 text-4xl shadow-lg">
             <BsSuitSpadeFill />
           </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-2 font-serif">Royal Cards</h1>
        <p className="text-gray-400 text-center mb-8">A sleek trick-taking game</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-casino-gold focus:border-transparent outline-none transition-all"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Game Rules</label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'suit-follows', name: 'Suit Follows', desc: 'Must follow suit. High card of led suit wins.' },
                { id: 'highest-card', name: 'Highest Card', desc: 'Suits don\'t matter. Highest value wins.' },
                { id: 'spades-trump', name: 'Spades Trump', desc: 'Spades beat everything. Classic style.' }
              ].map((rule) => (
                <button
                  key={rule.id}
                  onClick={() => setRuleSet(rule.id as RuleSet)}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    ruleSet === rule.id 
                      ? 'bg-casino-blue border-casino-gold ring-1 ring-casino-gold' 
                      : 'bg-gray-700 border-transparent hover:bg-gray-600'
                  }`}
                >
                  <div className="font-bold">{rule.name}</div>
                  <div className="text-xs text-gray-300">{rule.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleStart}
              disabled={!name.trim()}
              className="w-full bg-casino-gold hover:bg-yellow-400 text-gray-900 font-bold py-4 rounded-xl shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enter Table
            </button>
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={() => setShowRules(true)}
              className="text-gray-400 hover:text-white flex items-center gap-2 text-sm"
            >
              <BsQuestionCircle /> How to Play
            </button>
          </div>
        </div>
      </motion.div>

      <Modal 
        isOpen={showRules} 
        onClose={() => setShowRules(false)}
        title="How to Play"
      >
        <HowToPlay />
      </Modal>
    </div>
  );
};

