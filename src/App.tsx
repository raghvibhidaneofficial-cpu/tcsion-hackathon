import React, { useState } from 'react';
import { initialStreets, emergencyShelters, calculateRisk } from './data/nagpurStreets';
import { StreetSegment, Shelter, SafeRoute, Language, WaterDepthLevel, HazardType, DispatchStatus } from './types/flood';
import { translations } from './data/translations';
import { calculateSafeRoute } from './utils/routing';
import { speakText, stopSpeaking, isSpeaking } from './utils/audio';

import { Navbar } from './components/Navbar';
import { FloodMap } from './components/FloodMap';
import { ReportModal } from './components/ReportModal';
import { SafeRoutePanel } from './components/SafeRoutePanel';
import { WardOfficerPanel } from './components/WardOfficerPanel';
import { AlertShareModal } from './components/AlertShareModal';
import { LowLiteracyGuideModal } from './components/LowLiteracyGuideModal';

import { ShieldAlert, Navigation, Share2, AlertTriangle, X } from 'lucide-react';

export default function App() {
  const [streets, setStreets] = useState<StreetSegment[]>(initialStreets);
  const [shelters] = useState<Shelter[]>(emergencyShelters);
  const [selectedStreet, setSelectedStreet] = useState<StreetSegment | null>(null);
  const [activeRoute, setActiveRoute] = useState<SafeRoute | null>(null);
  const [language, setLanguage] = useState<Language>('hi'); // Default Hindi for local context
  const [activeView, setActiveView] = useState<'resident' | 'officer'>('resident');

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  const t = translations[language];

  // Handler: Crowdsourced Report Submitted
  const handleSubmitReport = (report: {
    streetId: string;
    depthLevel: WaterDepthLevel;
    hazards: HazardType[];
    photoUrl?: string;
    notes?: string;
  }) => {
    setStreets((prevStreets) =>
      prevStreets.map((street) => {
        if (street.id === report.streetId) {
          const isExitBlocked = report.hazards.includes('exit_blocked');
          const newReportCount = street.reportCount + 1;
          const newRiskLevel = calculateRisk(
            street.baselineRisk,
            report.depthLevel,
            isExitBlocked,
            newReportCount
          );

          const updated: StreetSegment = {
            ...street,
            currentDepth: report.depthLevel,
            hazards: report.hazards,
            isExitBlocked,
            riskLevel: newRiskLevel,
            reportCount: newReportCount,
            lastUpdated: 'Just now',
            notes: report.notes || street.notes
          };

          // Also update selected street if it's the current one
          if (selectedStreet?.id === street.id) {
            setSelectedStreet(updated);
          }
          return updated;
        }
        return street;
      })
    );
  };

  // Handler: Ward Officer Dispatches Pump / Boat / Clear
  const handleOfficerDispatch = (streetId: string, action: DispatchStatus) => {
    setStreets((prevStreets) =>
      prevStreets.map((s) => {
        if (s.id === streetId) {
          const updated: StreetSegment = {
            ...s,
            dispatchStatus: action,
            lastUpdated: 'Officer dispatched'
          };
          if (selectedStreet?.id === streetId) {
            setSelectedStreet(updated);
          }
          return updated;
        }
        return s;
      })
    );
  };

  // Handler: Compute Safe Route for street
  const handleFindRoute = (startStreet: StreetSegment, customShelter?: Shelter) => {
    setSelectedStreet(startStreet);
    const destination = customShelter || shelters[0];
    const computed = calculateSafeRoute(startStreet, destination, streets);
    setActiveRoute(computed);
  };

  // Handler: Toggle Voice Speech Readout
  const handleToggleAudio = () => {
    if (isAudioPlaying || isSpeaking()) {
      stopSpeaking();
      setIsAudioPlaying(false);
    } else {
      const activeStreet = selectedStreet || streets[0];
      const streetName =
        language === 'hi'
          ? activeStreet.nameHi
          : language === 'mr'
          ? activeStreet.nameMr
          : activeStreet.name;
      const depthInfo = t.depthLevels[activeStreet.currentDepth];
      const riskInfo = t.riskLevels[activeStreet.riskLevel];

      const announcement =
        language === 'hi'
          ? `नुक्कड़ बाढ़ चेतावनी। ${streetName} में पानी का स्तर ${depthInfo.title} है। यह ${riskInfo.label} क्षेत्र है। ${
              activeStreet.isExitBlocked ? 'रास्ता बंद है। सुरक्षित शिविर जाएँ।' : 'सावधानी से निकलें।'
            }`
          : language === 'mr'
          ? `नुक्कड पूर इशारा। ${streetName} मध्ये पाण्याची पातळी ${depthInfo.title} आहे. हा ${riskInfo.label} भाग आहे. ${
              activeStreet.isExitBlocked ? 'रस्ता बंद आहे. सुरक्षित निवारण केंद्रात जा.' : 'काळजीपूर्वक प्रवास करा.'
            }`
          : `Nukkad Flood Alert. ${streetName} is at ${riskInfo.label} with ${depthInfo.title}. ${
              activeStreet.isExitBlocked ? 'Exit is blocked. Please evacuate via safe route.' : 'Passable with caution.'
            }`;

      setIsAudioPlaying(true);
      speakText(announcement, language, () => {
        setIsAudioPlaying(false);
      });
    }
  };

  const selectedStreetDisplayName = selectedStreet
    ? language === 'hi'
      ? selectedStreet.nameHi
      : language === 'mr'
      ? selectedStreet.nameMr
      : selectedStreet.name
    : '';

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 text-slate-900 select-none">
      
      {/* Top Bar Header */}
      <Navbar
        language={language}
        onLanguageChange={(l) => {
          setLanguage(l);
          stopSpeaking();
          setIsAudioPlaying(false);
        }}
        activeView={activeView}
        onViewChange={(v) => setActiveView(v)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenSafeRoute={() => {
          if (selectedStreet) {
            handleFindRoute(selectedStreet);
          } else {
            handleFindRoute(streets[0]);
          }
        }}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
      />

      {/* Main Map Viewport & Overlay Panels */}
      <div className="relative flex-1 w-full h-[calc(100vh-4rem)] overflow-hidden">
        
        {/* Full-screen Leaflet Map */}
        <FloodMap
          streets={streets}
          shelters={shelters}
          selectedStreet={selectedStreet}
          onSelectStreet={(street) => setSelectedStreet(street)}
          activeRoute={activeRoute}
          language={language}
          activeView={activeView}
          onReportHere={(street) => {
            setSelectedStreet(street);
            setIsReportModalOpen(true);
          }}
          onFindRouteFromHere={(street) => handleFindRoute(street)}
          onOpenAlertModal={(street) => {
            setSelectedStreet(street);
            setIsAlertModalOpen(true);
          }}
          onOfficerDispatch={handleOfficerDispatch}
        />

        {/* Resident Selected Street Summary Floating Card (Bottom-Left) */}
        {activeView === 'resident' && selectedStreet && !activeRoute && (
          <div className="absolute bottom-6 left-4 right-4 sm:right-auto sm:w-96 z-30 bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5 mb-2.5">
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm ${
                    selectedStreet.riskLevel === 'severe'
                      ? 'bg-red-600'
                      : selectedStreet.riskLevel === 'high'
                      ? 'bg-orange-500'
                      : selectedStreet.riskLevel === 'watch'
                      ? 'bg-amber-500'
                      : 'bg-emerald-600'
                  }`}
                >
                  {selectedStreet.riskLevel === 'severe'
                    ? '🚨'
                    : selectedStreet.riskLevel === 'high'
                    ? '⚠️'
                    : selectedStreet.riskLevel === 'watch'
                    ? '👟'
                    : '✅'}
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    {selectedStreet.ward}
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                    {selectedStreetDisplayName}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedStreet(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Depth & Risk Info */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-500 block text-[10px] font-semibold">Water Level:</span>
                <span className="font-bold text-slate-900">
                  {t.depthLevels[selectedStreet.currentDepth].title} ({t.depthLevels[selectedStreet.currentDepth].depthCm})
                </span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-500 block text-[10px] font-semibold">Passability:</span>
                <span className={`font-bold ${selectedStreet.isExitBlocked ? 'text-red-600' : 'text-emerald-700'}`}>
                  {selectedStreet.isExitBlocked ? '🚫 Blocked' : '✅ Passable'}
                </span>
              </div>
            </div>

            {/* 3 Quick Action Buttons for Residents */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="py-2 px-1 text-center bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs shadow-sm transition active:scale-95 flex flex-col items-center justify-center gap-0.5"
              >
                <span className="text-sm">⚠️</span>
                <span>Report</span>
              </button>
              <button
                onClick={() => handleFindRoute(selectedStreet)}
                className="py-2 px-1 text-center bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-sm transition active:scale-95 flex flex-col items-center justify-center gap-0.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Safe Route</span>
              </button>
              <button
                onClick={() => setIsAlertModalOpen(true)}
                className="py-2 px-1 text-center bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-sm transition active:scale-95 flex flex-col items-center justify-center gap-0.5"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        {/* Safe Route Panel Overlay (when active) */}
        {activeRoute && (
          <div className="absolute top-4 left-4 right-4 sm:right-auto z-30 max-h-[85vh] overflow-y-auto">
            <SafeRoutePanel
              route={activeRoute}
              shelters={shelters}
              onSelectShelter={(shelter) => {
                if (selectedStreet) {
                  handleFindRoute(selectedStreet, shelter);
                }
              }}
              onClearRoute={() => setActiveRoute(null)}
              language={language}
            />
          </div>
        )}

        {/* Ward Officer Dashboard Overlay (when Officer mode active) */}
        {activeView === 'officer' && (
          <div className="absolute top-4 right-4 bottom-8 z-30 w-full sm:w-[460px] max-w-[94vw] overflow-y-auto">
            <WardOfficerPanel
              streets={streets}
              selectedStreet={selectedStreet}
              onSelectStreet={(street) => setSelectedStreet(street)}
              onOfficerDispatch={handleOfficerDispatch}
              language={language}
            />
          </div>
        )}

      </div>

      {/* Resident Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        streets={streets}
        initialStreet={selectedStreet}
        language={language}
        onSubmitReport={handleSubmitReport}
      />

      {/* Regional Language Alert & WhatsApp Modal */}
      <AlertShareModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        street={selectedStreet || streets[0]}
        nearestShelter={shelters[0]}
        language={language}
        onLanguageChange={(l) => setLanguage(l)}
      />

      {/* Low-Literacy Visual Guide & Emergency Helpline Modal */}
      <LowLiteracyGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        language={language}
      />

    </div>
  );
}
