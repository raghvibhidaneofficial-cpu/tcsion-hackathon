import React from 'react';
import { Language } from '../types/flood';
import { translations } from '../data/translations';
import { X, Volume2, ShieldCheck, AlertCircle, AlertTriangle, AlertOctagon, Phone } from 'lucide-react';
import { speakText } from '../utils/audio';

interface LowLiteracyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const LowLiteracyGuideModal: React.FC<LowLiteracyGuideModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  const handleVoiceExplain = () => {
    const summary =
      language === 'hi'
        ? "नक्शे के रंग समझें: हरा यानी सुरक्षित, रास्ता खुला है। पीला यानी टखने तक पानी, संभलकर चलें। नारंगी यानी घुटनों तक पानी, गाड़ी न ले जाएँ। लाल यानी कमर से ऊपर पानी या रास्ता बंद, तुरंत सुरक्षित शिविर जाएँ।"
        : language === 'mr'
        ? "नकाशाचे रंग समजून घ्या: हिरवा म्हणजे सुरक्षित, रस्ता खुला आहे. पिवळा म्हणजे घोट्यापर्यंत पाणी, काळजीपूर्वक चाला. केशरी म्हणजे गुडघ्यापर्यंत पाणी, दुचाकी नेऊ नका. लाल म्हणजे कमरेच्या वर पाणी किंवा रस्ता बंद, तातडीने निवारण केंद्रात जा."
        : "Map guide: Green means safe and open. Yellow means ankle deep water. Orange means knee deep water, avoid bikes. Red means severe flood or blocked exit, evacuate to shelter immediately.";
    speakText(summary, language);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg">
              📖
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-tight">
                {language === 'hi' ? 'चित्र मार्गदर्शिका (आसान समझ)' : language === 'mr' ? 'चित्र मार्गदर्शक (सोप्या भाषेत)' : 'Visual Icon Guide'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'रंग और संकेतों का अर्थ' : language === 'mr' ? 'रंग आणि चिन्हांचा अर्थ' : 'Symbols & Road Colors'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleVoiceExplain}
              className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition flex items-center gap-1 text-xs font-bold"
              title="Listen to voice explanation"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">आवाज़ सुनें</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 text-slate-800">
          
          {/* Section 1: Road Colors */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              1. {language === 'hi' ? 'सड़क का रंग क्या बताता है?' : language === 'mr' ? 'रस्त्याचा रंग काय सांगतो?' : 'What do road colors mean?'}
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              
              {/* Green */}
              <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-start gap-2.5">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-900">
                    {language === 'hi' ? 'हरा: सुरक्षित' : language === 'mr' ? 'हिरवा: सुरक्षित' : 'Green: Safe'}
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    {language === 'hi' ? 'रास्ता सूखा व खुला है' : language === 'mr' ? 'रस्ता कोरडा व खुला आहे' : 'Walkable & open to all'}
                  </div>
                </div>
              </div>

              {/* Yellow */}
              <div className="p-3 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-start gap-2.5">
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-amber-900">
                    {language === 'hi' ? 'पीला: सतर्क' : language === 'mr' ? 'पिवळा: सतर्क' : 'Yellow: Watch'}
                  </div>
                  <div className="text-[11px] text-amber-700">
                    {language === 'hi' ? 'टखने तक पानी (~15cm)' : language === 'mr' ? 'घोट्यापर्यंत पाणी (~15cm)' : 'Ankle deep (~15cm)'}
                  </div>
                </div>
              </div>

              {/* Orange */}
              <div className="p-3 rounded-2xl bg-orange-50 border-2 border-orange-200 flex items-start gap-2.5">
                <AlertTriangle className="w-6 h-6 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-orange-900">
                    {language === 'hi' ? 'नारंगी: खतरा' : language === 'mr' ? 'केशरी: धोका' : 'Orange: High'}
                  </div>
                  <div className="text-[11px] text-orange-700">
                    {language === 'hi' ? 'घुटनों तक पानी (~45cm)' : language === 'mr' ? 'गुडघ्यापर्यंत पाणी (~45cm)' : 'Knee deep (~45cm)'}
                  </div>
                </div>
              </div>

              {/* Red */}
              <div className="p-3 rounded-2xl bg-red-50 border-2 border-red-200 flex items-start gap-2.5">
                <AlertOctagon className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-red-900">
                    {language === 'hi' ? 'लाल: गंभीर' : language === 'mr' ? 'लाल: गंभीर' : 'Red: Severe'}
                  </div>
                  <div className="text-[11px] text-red-700">
                    {language === 'hi' ? 'कमर तक पानी / रास्ता बंद' : language === 'mr' ? 'कमरेपर्यंत पाणी / रस्ता बंद' : 'Waist deep / Blocked'}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Hazard Icons */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              2. {language === 'hi' ? 'खतरे के मुख्य चिन्ह' : language === 'mr' ? 'धोक्याची प्रमुख चिन्हे' : 'Key Hazard Signs'}
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                <span className="text-2xl">🚫</span>
                <div>
                  <div className="font-bold text-slate-900">
                    {language === 'hi' ? 'रास्ता बंद' : language === 'mr' ? 'रस्ता बंद' : 'Exit Blocked'}
                  </div>
                  <div className="text-[10px] text-slate-500">Do not enter</div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                <span className="text-2xl">🕳️</span>
                <div>
                  <div className="font-bold text-slate-900">
                    {language === 'hi' ? 'खुला नाला' : language === 'mr' ? 'उघडी गटार' : 'Open Drain'}
                  </div>
                  <div className="text-[10px] text-slate-500">Deep fall hazard</div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <div>
                  <div className="font-bold text-slate-900">
                    {language === 'hi' ? 'बिजली करंट' : language === 'mr' ? 'विजेचा झटका' : 'Electric Wire'}
                  </div>
                  <div className="text-[10px] text-slate-500">Stay away from water</div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                <span className="text-2xl">🏛️</span>
                <div>
                  <div className="font-bold text-slate-900">
                    {language === 'hi' ? 'सुरक्षित शिविर' : language === 'mr' ? 'निवारण केंद्र' : 'Safe Shelter'}
                  </div>
                  <div className="text-[10px] text-slate-500">Food, water, beds</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Emergency Helpline Nagpur */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl space-y-1.5">
            <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>{language === 'hi' ? 'नागपुर आपातकालीन सहायता नंबर' : language === 'mr' ? 'नागपूर आपत्कालीन मदत क्रमांक' : 'Nagpur Emergency Helplines'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1">
              <div>NMC Flood Control: <b>0712-2567001</b></div>
              <div>Disaster Helpline: <b>1077</b></div>
              <div>Ambulance: <b>108</b></div>
              <div>Fire & Rescue: <b>101</b></div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
