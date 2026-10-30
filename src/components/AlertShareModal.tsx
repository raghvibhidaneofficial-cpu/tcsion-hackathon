import React, { useState } from 'react';
import { StreetSegment, Shelter, Language } from '../types/flood';
import { translations } from '../data/translations';
import { X, Share2, Copy, Check, Volume2, MessageSquare, PhoneCall } from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/audio';

interface AlertShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  street: StreetSegment | null;
  nearestShelter: Shelter;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const AlertShareModal: React.FC<AlertShareModalProps> = ({
  isOpen,
  onClose,
  street,
  nearestShelter,
  language,
  onLanguageChange
}) => {
  if (!isOpen || !street) return null;

  const [copied, setCopied] = useState<boolean>(false);
  const t = translations[language];

  const streetDisplayName =
    language === 'hi' ? street.nameHi : language === 'mr' ? street.nameMr : street.name;
  const shelterDisplayName =
    language === 'hi' ? nearestShelter.nameHi : language === 'mr' ? nearestShelter.nameMr : nearestShelter.name;
  const depthInfo = t.depthLevels[street.currentDepth];
  const riskInfo = t.riskLevels[street.riskLevel];

  // Generate WhatsApp formatted text
  const whatsappText = t.whatsappMessageTemplate(
    streetDisplayName,
    street.ward,
    `${depthInfo.title} (${depthInfo.depthCm})`,
    riskInfo.label,
    street.isExitBlocked,
    shelterDisplayName
  );

  // Generate short SMS formatted text
  const smsText = t.smsMessageTemplate(
    streetDisplayName,
    `${depthInfo.title} (${depthInfo.depthCm})`,
    riskInfo.label,
    street.isExitBlocked,
    shelterDisplayName
  );

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(whatsappText);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleCopySms = () => {
    navigator.clipboard.writeText(smsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleVoiceReadout = () => {
    speakText(smsText, language);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-tight">
                {t.laneAlertTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {streetDisplayName}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5">
          
          {/* Language Toggle in Modal */}
          <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-2xl">
            <span className="text-xs font-bold text-slate-600 pl-2">Language / भाषा:</span>
            <div className="flex items-center gap-1">
              {(['hi', 'mr', 'en'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onLanguageChange(lang)}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition ${
                    language === lang
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang === 'hi' ? 'हिन्दी (Hindi)' : lang === 'mr' ? 'मराठी (Marathi)' : 'English'}
                </button>
              ))}
            </div>
          </div>

          {/* WhatsApp Message Preview Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Community Alert Preview</span>
              </span>
              <button
                type="button"
                onClick={handleVoiceReadout}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <Volume2 className="w-4 h-4" />
                <span>{t.audioGuideButton}</span>
              </button>
            </div>

            {/* WhatsApp Green Bubble Box */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-slate-800 whitespace-pre-line font-mono font-medium shadow-inner leading-relaxed">
              {whatsappText}
            </div>
          </div>

          {/* SMS Short Text Preview */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-blue-600" />
              <span>SMS Alert (For Basic Feature Phones)</span>
            </span>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-mono">
              {smsText}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleShareWhatsApp}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg transition active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>{t.shareWhatsApp}</span>
            </button>

            <button
              onClick={handleCopySms}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl transition flex items-center justify-center gap-2 text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">{t.smsCopied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>{t.copySms}</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
