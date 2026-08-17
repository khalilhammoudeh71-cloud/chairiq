import React, { useState, useEffect } from 'react';
import { Type, Volume2, VolumeX } from 'lucide-react';

const AccessibilityControls = ({ language = 'en' }) => {
  const [fontSize, setFontSize] = useState('medium');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    // Check if speech synthesis is supported
    setSpeechSupported('speechSynthesis' in window);

    // Load saved font size preference
    const savedSize = localStorage.getItem('chairiq-font-size');
    if (savedSize) {
      setFontSize(savedSize);
      applyFontSize(savedSize);
    }
  }, []);

  const applyFontSize = (size) => {
    const root = document.documentElement;
    switch (size) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'medium':
        root.style.fontSize = '16px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
      case 'extra-large':
        root.style.fontSize = '20px';
        break;
      default:
        root.style.fontSize = '16px';
    }
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    applyFontSize(size);
    localStorage.setItem('chairiq-font-size', size);
  };

  const stopSpeaking = () => {
    if (window?.speechSynthesis) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  };

  const speakText = (text, lang = 'en-US') => {
    if (!speechSupported || !text) return;

    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'es' ? 'es-ES' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis?.speak(utterance);
  };

  const labels = {
    en: {
      textSize: 'Text Size',
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      extraLarge: 'Extra Large',
      audioDesc: 'Audio Descriptions',
      stopAudio: 'Stop Audio'
    },
    es: {
      textSize: 'Tamaño de Texto',
      small: 'Pequeño',
      medium: 'Mediano',
      large: 'Grande',
      extraLarge: 'Extra Grande',
      audioDesc: 'Descripciones de Audio',
      stopAudio: 'Detener Audio'
    }
  };

  const t = labels?.[language] || labels?.en;

  return (
    <div className="accessibility-controls bg-bg2 border border-bd rounded p-4">
      {/* Text Size Controls */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Type className="w-5 h-5 text-success" />
          <label className="text-sm font-bold text-t2">
            {t?.textSize}
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          {['small', 'medium', 'large', 'extra-large']?.map((size) => (
            <button
              key={size}
              onClick={() => handleFontSizeChange(size)}
              className={`px-3 py-1.5 text-sm rounded border-2 ${
                fontSize === size
                  ? 'bg-success text-accent-foreground border-success' :'bg-bg2/60 text-t3 border-bd/50 hover:border-success/60 hover:bg-bg3/60'
              }`}
              aria-pressed={fontSize === size}
            >
              {size === 'small' && t?.small}
              {size === 'medium' && t?.medium}
              {size === 'large' && t?.large}
              {size === 'extra-large' && t?.extraLarge}
            </button>
          ))}
        </div>
      </div>
      {/* Audio Description Toggle */}
      {speechSupported && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            {isSpeaking ? (
              <Volume2 className="w-5 h-5 text-success" />
            ) : (
              <VolumeX className="w-5 h-5 text-t3" />
            )}
            <label className="text-sm font-bold text-t2">
              {t?.audioDesc}
            </label>
          </div>
          <button
            onClick={stopSpeaking}
            disabled={!isSpeaking}
            className={`px-4 py-2 text-sm rounded border-2 ${
              isSpeaking
                ? 'bg-danger text-white border-danger hover:brightness-110' :'bg-bg2/40 text-t3 border-bd/40 cursor-not-allowed'
            }`}
            aria-label={t?.stopAudio}
          >
            {t?.stopAudio}
          </button>
        </div>
      )}
    </div>
  );
};

export default AccessibilityControls;