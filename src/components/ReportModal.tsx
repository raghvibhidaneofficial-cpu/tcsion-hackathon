import React, { useState } from 'react';
import { StreetSegment, WaterDepthLevel, HazardType, Language } from '../types/flood';
import { translations } from '../data/translations';
import { sampleFloodPhotos } from '../data/nagpurStreets';
import { X, Camera, Check, AlertOctagon, MapPin, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  streets: StreetSegment[];
  initialStreet: StreetSegment | null;
  language: Language;
  onSubmitReport: (report: {
    streetId: string;
    depthLevel: WaterDepthLevel;
    hazards: HazardType[];
    photoUrl?: string;
    notes?: string;
  }) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  streets,
  initialStreet,
  language,
  onSubmitReport
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  const [selectedStreetId, setSelectedStreetId] = useState<string>(
    initialStreet?.id || streets[0]?.id || ''
  );
  const [depthLevel, setDepthLevel] = useState<WaterDepthLevel>(2); // Default Knee-deep
  const [hazards, setHazards] = useState<HazardType[]>(['exit_blocked']);
  const [photoUrl, setPhotoUrl] = useState<string>(sampleFloodPhotos[0].url);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const toggleHazard = (hazard: HazardType) => {
    setHazards((prev) =>
      prev.includes(hazard) ? prev.filter((h) => h !== hazard) : [...prev, hazard]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotoUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStreetId) return;

    onSubmitReport({
      streetId: selectedStreetId,
      depthLevel,
      hazards,
      photoUrl,
      notes
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  const selectedStreet = streets.find((s) => s.id === selectedStreetId);
  const currentDepthInfo = t.depthLevels[depthLevel];

  // Visual human gauge heights for water visualization
  const waterFillPercent: Record<WaterDepthLevel, number> = {
    0: 5,
    1: 18,
    2: 40,
    3: 65,
    4: 85,
    5: 100
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg">
              ⚠️
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {t.reportTitle}
              </h2>
              <p className="text-xs text-slate-500 hidden sm:block">
                {t.reportSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
            <h3 className="text-xl font-bold text-slate-900">{t.submitSuccessToast}</h3>
            <p className="text-sm text-slate-600">
              Ward disaster officers and neighbors have been notified.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
            
            {/* Step 1: Location / Street Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                {t.selectLocationStep}
              </label>
              <select
                value={selectedStreetId}
                onChange={(e) => setSelectedStreetId(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              >
                {streets.map((street) => {
                  const name =
                    language === 'hi' ? street.nameHi : language === 'mr' ? street.nameMr : street.name;
                  return (
                    <option key={street.id} value={street.id}>
                      {name} ({street.ward})
                    </option>
                  );
                })}
              </select>
              {selectedStreet && (
                <div className="text-[11px] text-slate-500 px-1">
                  Elevation: {selectedStreet.elevationMeters}m · Proximity to Nag River: {selectedStreet.proximityToRiverMeters}m
                </div>
              )}
            </div>

            {/* Step 2: Big Water-Depth Gauge & Slider for Low Literacy */}
            <div className="space-y-3 bg-blue-50/60 p-4 rounded-2xl border border-blue-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="text-base">📏</span>
                  {t.selectDepthStep}
                </label>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">
                  {currentDepthInfo.title} ({currentDepthInfo.depthCm})
                </span>
              </div>

              {/* Visual Human Water Height Gauge */}
              <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-blue-200">
                {/* SVG Silhouette with animated water level */}
                <div className="relative w-14 h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-300 shrink-0 flex items-end justify-center">
                  {/* Human outline SVG */}
                  <svg className="absolute inset-0 w-full h-full text-slate-400 z-10 pointer-events-none p-1" viewBox="0 0 40 80" fill="currentColor">
                    {/* Head */}
                    <circle cx="20" cy="12" r="7" />
                    {/* Torso & Arms */}
                    <path d="M12 24 L28 24 L28 48 L25 48 L25 74 L21 74 L21 52 L19 52 L19 74 L15 74 L15 48 L12 48 Z" />
                  </svg>
                  {/* Water level rectangle */}
                  <div
                    className="w-full bg-blue-500/80 transition-all duration-300"
                    style={{ height: `${waterFillPercent[depthLevel]}%` }}
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="text-sm font-bold text-slate-900 leading-tight">
                    {currentDepthInfo.title}
                  </div>
                  <div className="text-xs text-slate-600">
                    {currentDepthInfo.desc}
                  </div>
                  <div className="text-[11px] font-semibold text-blue-700">
                    {currentDepthInfo.vehicleStatus}
                  </div>
                </div>
              </div>

              {/* Water Depth Radio Grid (Large intuitive touch tiles) */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1">
                {([0, 1, 2, 3, 4, 5] as WaterDepthLevel[]).map((level) => {
                  const info = t.depthLevels[level];
                  const isSelected = depthLevel === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDepthLevel(level)}
                      className={`p-2 rounded-xl text-center border-2 transition-all flex flex-col items-center justify-between min-h-[64px] ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                      }`}
                    >
                      <span className="text-sm">
                        {level === 0 ? '☀️' : level === 1 ? '👟' : level === 2 ? '🦵' : level === 3 ? '🩳' : level === 4 ? '🦺' : '🚨'}
                      </span>
                      <span className="text-[10px] font-bold leading-tight mt-1 line-clamp-1">
                        {info.title.split(' ')[0]}
                      </span>
                      <span className={`text-[9px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {info.depthCm}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Hazard Spot Toggles (Exit Blocked, Open Manhole, Electric Wire, Fast Current) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-amber-600" />
                {t.markHazardsStep}
              </label>

              <div className="grid grid-cols-2 gap-2">
                {(['exit_blocked', 'open_manhole', 'electric_hazard', 'fast_current'] as HazardType[]).map((hazard) => {
                  const isChecked = hazards.includes(hazard);
                  const hazardInfo = t.hazards[hazard];
                  const icons: Record<HazardType, string> = {
                    exit_blocked: '🚫',
                    open_manhole: '🕳️',
                    electric_hazard: '⚡',
                    fast_current: '🌊'
                  };

                  return (
                    <button
                      key={hazard}
                      type="button"
                      onClick={() => toggleHazard(hazard)}
                      className={`p-3 rounded-2xl border-2 text-left transition flex items-start gap-2.5 ${
                        isChecked
                          ? 'border-red-500 bg-red-50 text-red-950 font-semibold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-lg shrink-0 mt-0.5">{icons[hazard]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold leading-snug">{hazardInfo.label}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">{hazardInfo.desc}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${isChecked ? 'bg-red-600 border-red-600 text-white' : 'border-slate-300 bg-white'}`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Photo Evidence Upload / Sample Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-slate-600" />
                {t.addPhotoStep}
              </label>

              {/* Upload trigger + sample picker */}
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <label className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 cursor-pointer text-xs font-semibold text-slate-600 hover:text-blue-600 transition bg-slate-50">
                  <Camera className="w-4 h-4" />
                  <span>{t.uploadPhotoPlaceholder}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Or Quick Sample Photos */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">Samples:</span>
                  {sampleFloodPhotos.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => setPhotoUrl(sample.url)}
                      className={`w-12 h-10 rounded-xl overflow-hidden border-2 transition ${
                        photoUrl === sample.url ? 'border-blue-600 ring-2 ring-blue-400' : 'border-slate-200'
                      }`}
                      title={sample.label}
                    >
                      <img src={sample.url} alt={sample.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Preview */}
              {photoUrl && (
                <div className="relative w-full h-28 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 mt-2">
                  <img
                    src={photoUrl}
                    alt="Flood report preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                    Attached Evidence
                  </div>
                </div>
              )}
            </div>

            {/* Step 5: Optional Landmark Notes */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                {t.additionalNotes}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Near Shiv Mandir, 10 meters before culvert"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-md transition active:scale-95 flex items-center gap-2"
              >
                <span>⚠️</span>
                <span>{t.submit}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
