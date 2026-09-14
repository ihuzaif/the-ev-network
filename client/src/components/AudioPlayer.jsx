import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, FastForward } from 'lucide-react';

export default function AudioPlayer({ textToRead, title }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [supported, setSupported] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTogglePlay = () => {
    if (!supported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      // Clean markdown symbols for cleaner speech
      const cleanText = `${title}. ${textToRead.replace(/[#*`>-]/g, ' ')}`;
      const utterance = new SpeechSynthesisUtterance(cleanText.substring(0, 1500)); // First ~1500 chars for smooth reading
      utterance.rate = rate;
      utterance.pitch = 1;

      utterance.onend = () => {
        setIsPlaying(false);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = () => {
    const nextRate = rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : 1;
    setRate(nextRate);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  if (!supported) return null;

  return (
    <div className="bg-[#151924] border border-[#263044] rounded-xl p-3.5 sm:p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-3">
        <button 
          onClick={handleTogglePlay}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-lg ${
            isPlaying ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black hover:brightness-110'
          }`}>
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
        </button>

        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {isPlaying ? 'Now Playing' : 'Listen to this Article'}
            </span>
            {isPlaying && (
              <span className="flex space-x-1 items-end h-3">
                <span className="w-1 bg-[#00aeef] h-2 animate-bounce" />
                <span className="w-1 bg-[#38bdf8] h-3 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1 bg-emerald-400 h-1.5 animate-bounce [animation-delay:0.4s]" />
              </span>
            )}
          </div>
          <span className="text-[11px] text-gray-400">
            {isPlaying ? 'AI Audio Synthesizer active' : 'Click to listen via browser speech synthesis'}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button 
          onClick={handleSpeedChange}
          className="text-xs font-mono font-bold px-2 py-1 rounded bg-[#1f2638] text-gray-300 hover:text-white border border-[#2f3a54] transition">
          {rate}x Speed
        </button>
      </div>
    </div>
  );
}
