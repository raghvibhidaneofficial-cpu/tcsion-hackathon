import React from 'react';
import { SafeRoute, Shelter, Language } from '../types/flood';
import { translations } from '../data/translations';
import { Navigation, ShieldCheck, X, Volume2, Phone, Home } from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/audio';

interface SafeRoutePanelProps {
  route: SafeRoute | null;
  shelters: Shelter[];
  onSelectShelter: (shelter: Shelter) => void;
  onClearRoute: () => void;
  language: Language;
}

export const SafeRoutePanel: React.FC<SafeRoutePanelProps> = ({
  route,
  shelters,
  onSelectShelter,
  onClearRoute,
  language
}) => {
  if (!route) return null;

  const t = translations[language];
  const { destinationShelter, startStreet, totalDistanceMeters, estimatedWalkMinutes, instructionsEn, instructionsHi, instructionsMr } = route;

  const instructions =
    language === 'hi' ? instructionsHi : language === 'mr' ? instructionsMr : instructionsEn;
  const shelterName =
    language === 'hi' ? destinationShelter.nameHi : language === 'mr' ? destinationShelter.nameMr : destinationShelter.name;
  const startStreetName =
    language === 'hi' ? startStreet.nameHi : language === 'mr' ? startStreet.nameMr : startStreet.name;

  const handleReadDirections = () => {
    const fullDirections = `Safe route from ${startStreetName} to ${shelterName}. Total distance ${totalDistanceMeters} meters. Walking time ${estimatedWalkMinutes} minutes. ${instructions.join('. ')}`;
    speakText(fullDirections, language);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xl border border-emerald-200 space-y-4 max-w-lg w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-emerald-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Navigation className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 leading-tight">
              {t.safeRouteTitle}
            </h3>
            <p className="text-xs text-slate-500">
              {startStreetName} ➔ {shelterName}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            stopSpeaking();
            onClearRoute();
          }}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          title="Clear Route"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* High-level Safe Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-emerald-50/70 p-2.5 rounded-2xl border border-emerald-100 text-center">
          <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
            {t.walkTime}
          </div>
          <div className="text-lg font-extrabold text-emerald-700 tabular-nums">
            ~{estimatedWalkMinutes} min
          </div>
        </div>

        <div className="bg-emerald-50/70 p-2.5 rounded-2xl border border-emerald-100 text-center">
          <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
            {t.distance}
          </div>
          <div className="text-lg font-extrabold text-emerald-700 tabular-nums">
            {totalDistanceMeters}m
          </div>
        </div>

        <div className="bg-emerald-50/70 p-2.5 rounded-2xl border border-emerald-100 text-center">
          <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
            Status
          </div>
          <div className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 mt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Safe</span>
          </div>
        </div>
      </div>

      {/* Shelter Destination Info Card */}
      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Home className="w-4 h-4 text-blue-600" />
            <span>{t.nearestShelter}</span>
          </div>
          {/* Switch Shelter dropdown */}
          <select
            value={destinationShelter.id}
            onChange={(e) => {
              const target = shelters.find((s) => s.id === e.target.value);
              if (target) onSelectShelter(target);
            }}
            className="text-[11px] font-semibold bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-800"
          >
            {shelters.map((s) => (
              <option key={s.id} value={s.id}>
                {language === 'hi' ? s.nameHi : language === 'mr' ? s.nameMr : s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs font-bold text-slate-900">
          {shelterName}
        </div>
        <div className="text-[11px] text-slate-600 flex items-center justify-between">
          <span>Capacity: {destinationShelter.capacity - destinationShelter.currentOccupancy} beds free</span>
          <span className="flex items-center gap-1 text-blue-700 font-semibold">
            <Phone className="w-3 h-3" />
            {destinationShelter.contactNumber}
          </span>
        </div>
      </div>

      {/* Safety Guarantee Notice */}
      <div className="flex items-center gap-2 p-2.5 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-medium border border-emerald-200">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>{t.avoidsDangerousLanes}</span>
      </div>

      {/* Turn-by-Turn Navigation Steps */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span>{t.startWalkingGuidance}</span>
          <button
            onClick={handleReadDirections}
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Listen Voice</span>
          </button>
        </div>

        <div className="space-y-1 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 max-h-36 overflow-y-auto">
          {instructions.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span className="leading-snug">{step}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
