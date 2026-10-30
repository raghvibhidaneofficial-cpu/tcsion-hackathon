import React from 'react';
import { Language } from '../types/flood';
import { translations } from '../data/translations';
import { Map, ShieldAlert, Navigation, HelpCircle, Volume2, VolumeX, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeView: 'resident' | 'officer';
  onViewChange: (view: 'resident' | 'officer') => void;
  onOpenReportModal: () => void;
  onOpenSafeRoute: () => void;
  onOpenGuide: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  activeView,
  onViewChange,
  onOpenReportModal,
  onOpenSafeRoute,
  onOpenGuide,
  isAudioPlaying,
  onToggleAudio
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Brand Wordmark (Single text element with clean styling) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
              {t.appName}
            </span>
            <span className="text-[10px] text-blue-300 font-medium tracking-wide hidden sm:block">
              Nagpur · Nag River Basin
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation & Mode Switchers (Single line controls) */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => onViewChange('resident')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeView === 'resident'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.residentView}</span>
              <span className="md:hidden">Resident</span>
            </button>
            <button
              onClick={() => onViewChange('officer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeView === 'officer'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">{t.officerDashboard}</span>
              <span className="md:hidden">Officer</span>
            </button>
          </div>

          {/* Quick Safe Route Button */}
          <button
            onClick={onOpenSafeRoute}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.findSafeRouteButton}</span>
          </button>

          {/* Low-Literacy Visual Guide Button */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            title="Visual Legend & Guide"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Visual Guide</span>
          </button>
        </nav>

        {/* Zone 3: Language Selector & Audio Announcement & Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Audio speech trigger */}
          <button
            onClick={onToggleAudio}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors ${
              isAudioPlaying
                ? 'bg-red-500/20 border-red-500 text-red-300 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Listen to emergency voice alert"
          >
            {isAudioPlaying ? (
              <>
                <VolumeX className="w-4 h-4 text-red-400" />
                <span className="hidden xl:inline text-[11px] font-medium">Stop Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="hidden xl:inline text-[11px] font-medium">Voice Alert</span>
              </>
            )}
          </button>

          {/* Language Toggle: EN / HI / MR */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700">
            {(['en', 'hi', 'mr'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  language === lang
                    ? 'bg-white text-slate-900 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिन्दी' : 'मराठी'}
              </button>
            ))}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onOpenReportModal}
            className="px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span className="text-sm">⚠️</span>
            <span className="hidden sm:inline">{t.reportFloodButton}</span>
            <span className="sm:hidden">Report</span>
          </button>
        </div>

      </div>
    </header>
  );
};
