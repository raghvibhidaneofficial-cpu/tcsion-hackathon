import React, { useState } from 'react';
import { StreetSegment, Language, DispatchStatus } from '../types/flood';
import { translations } from '../data/translations';
import { AlertTriangle, Filter, CheckCircle2, Siren, ChevronRight, Activity } from 'lucide-react';

interface WardOfficerPanelProps {
  streets: StreetSegment[];
  selectedStreet: StreetSegment | null;
  onSelectStreet: (street: StreetSegment) => void;
  onOfficerDispatch: (streetId: string, action: DispatchStatus) => void;
  language: Language;
}

export const WardOfficerPanel: React.FC<WardOfficerPanelProps> = ({
  streets,
  selectedStreet,
  onSelectStreet,
  onOfficerDispatch,
  language
}) => {
  const t = translations[language];
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [toastMessage, setToMessage] = useState<string | null>(null);

  // Filter streets by ward
  const filteredStreets = selectedWard === 'all'
    ? streets
    : streets.filter((s) => s.ward.includes(selectedWard));

  // Sort by priority: severe first, exit blocked first, highest report count
  const rankedStreets = [...filteredStreets].sort((a, b) => {
    const riskScore = { severe: 4, high: 3, watch: 2, safe: 1 };
    const scoreA = riskScore[a.riskLevel] * 10 + (a.isExitBlocked ? 15 : 0) + a.reportCount;
    const scoreB = riskScore[b.riskLevel] * 10 + (b.isExitBlocked ? 15 : 0) + b.reportCount;
    return scoreB - scoreA;
  });

  // Calculate summary metrics
  const severeCount = streets.filter((s) => s.riskLevel === 'severe').length;
  const blockedExitsCount = streets.filter((s) => s.isExitBlocked).length;
  const pumpsCount = streets.filter((s) => s.dispatchStatus === 'pump_dispatched').length;
  const boatsCount = streets.filter((s) => s.dispatchStatus === 'boat_dispatched').length;

  const handleDispatchAction = (streetId: string, action: DispatchStatus, streetName: string) => {
    onOfficerDispatch(streetId, action);
    const msg =
      action === 'pump_dispatched'
        ? `🚜 Dewatering Pump deployed to ${streetName}`
        : action === 'boat_dispatched'
        ? `🚤 NDRF Rescue Boat dispatched to ${streetName}`
        : `✅ Street status cleared by Officer for ${streetName}`;
    setToMessage(msg);
    setTimeout(() => setToMessage(null), 3000);
  };

  const uniqueWards = Array.from(new Set(streets.map((s) => s.ward)));

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-amber-300 space-y-4 max-w-xl w-full">
      
      {/* Officer Header */}
      <div className="flex items-center justify-between border-b border-amber-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-sm">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                {t.officerDashboard}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                Nagpur NMC Live
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Nag River Flood Operations & Hyperlocal Dispatch
            </p>
          </div>
        </div>

        {/* IMD Rainfall Index Badge */}
        <div className="text-right hidden sm:block">
          <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 justify-end">
            <Activity className="w-3 h-3 text-red-500 animate-pulse" />
            <span>IMD Rain Index</span>
          </div>
          <div className="text-xs font-extrabold text-red-600">
            68 mm/hr · Cloudburst
          </div>
        </div>
      </div>

      {/* Summary KPI Tiles */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-red-50 p-2.5 rounded-2xl border border-red-200 text-center">
          <div className="text-[10px] font-bold text-red-700 uppercase tracking-tight">
            Severe Lanes
          </div>
          <div className="text-xl font-extrabold text-red-600 tabular-nums">
            {severeCount}
          </div>
        </div>

        <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-200 text-center">
          <div className="text-[10px] font-bold text-amber-800 uppercase tracking-tight">
            Blocked Exits
          </div>
          <div className="text-xl font-extrabold text-amber-700 tabular-nums">
            {blockedExitsCount}
          </div>
        </div>

        <div className="bg-blue-50 p-2.5 rounded-2xl border border-blue-200 text-center">
          <div className="text-[10px] font-bold text-blue-700 uppercase tracking-tight">
            Pumps Sent
          </div>
          <div className="text-xl font-extrabold text-blue-600 tabular-nums">
            {pumpsCount}
          </div>
        </div>

        <div className="bg-sky-50 p-2.5 rounded-2xl border border-sky-200 text-center">
          <div className="text-[10px] font-bold text-sky-800 uppercase tracking-tight">
            Boats Sent
          </div>
          <div className="text-xl font-extrabold text-sky-700 tabular-nums">
            {boatsCount}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-2.5 bg-slate-900 text-amber-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter by Ward Bar */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span>{t.priorityStreets}</span>
        </div>
        <select
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          className="text-xs font-semibold bg-slate-100 border border-slate-300 rounded-xl px-2.5 py-1 text-slate-800"
        >
          <option value="all">{t.allWards}</option>
          {uniqueWards.map((w) => (
            <option key={w} value={w.split(' - ')[0]}>
              {w}
            </option>
          ))}
        </select>
      </div>

      {/* Ranked Priority List of Streets */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {rankedStreets.map((street, idx) => {
          const isSelected = selectedStreet?.id === street.id;
          const streetDisplayName =
            language === 'hi' ? street.nameHi : language === 'mr' ? street.nameMr : street.name;
          const depthInfo = t.depthLevels[street.currentDepth];

          const riskBadgeClasses = {
            severe: 'bg-red-100 text-red-700 border-red-300',
            high: 'bg-orange-100 text-orange-700 border-orange-300',
            watch: 'bg-amber-100 text-amber-700 border-amber-300',
            safe: 'bg-emerald-100 text-emerald-700 border-emerald-300'
          };

          return (
            <div
              key={street.id}
              onClick={() => onSelectStreet(street)}
              className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col gap-2 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/60 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                      {streetDisplayName}
                    </h4>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {street.ward} · {street.reportCount} reports · {depthInfo.title} ({depthInfo.depthCm})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${riskBadgeClasses[street.riskLevel]}`}>
                    {street.riskLevel}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  {street.isExitBlocked && (
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                      🚫 Exit Blocked
                    </span>
                  )}
                  {street.dispatchStatus !== 'none' && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {street.dispatchStatus === 'pump_dispatched' ? '🚜 Pump Sent' : '🚤 Boat Sent'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDispatchAction(street.id, 'pump_dispatched', streetDisplayName);
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition active:scale-95 shadow-sm"
                  >
                    🚜 {t.sendPump}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDispatchAction(street.id, 'boat_dispatched', streetDisplayName);
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition active:scale-95 shadow-sm"
                  >
                    🚤 {t.sendBoat}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Broadcast Ward Siren Warning Trigger */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          Broadcast lane warnings to registered phone numbers:
        </span>
        <button
          onClick={() => {
            setToMessage('🚨 Bulk SMS & WhatsApp siren broadcast pushed to 1,480 registered residents!');
            setTimeout(() => setToMessage(null), 3500);
          }}
          className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5 shadow-sm"
        >
          <Siren className="w-3.5 h-3.5 text-red-400" />
          <span>Broadcast Siren Alert</span>
        </button>
      </div>

    </div>
  );
};
