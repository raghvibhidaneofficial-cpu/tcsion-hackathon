import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { StreetSegment, Shelter, SafeRoute, Language, DispatchStatus } from '../types/flood';
import { translations } from '../data/translations';
import { nagRiverWaterwayCoordinates } from '../data/nagpurStreets';
import { Maximize2, Layers } from 'lucide-react';

interface FloodMapProps {
  streets: StreetSegment[];
  shelters: Shelter[];
  selectedStreet: StreetSegment | null;
  onSelectStreet: (street: StreetSegment) => void;
  activeRoute: SafeRoute | null;
  language: Language;
  activeView: 'resident' | 'officer';
  onReportHere: (street: StreetSegment) => void;
  onFindRouteFromHere: (street: StreetSegment) => void;
  onOpenAlertModal: (street: StreetSegment) => void;
  onOfficerDispatch: (streetId: string, action: DispatchStatus) => void;
}

export const FloodMap: React.FC<FloodMapProps> = ({
  streets,
  shelters,
  selectedStreet,
  onSelectStreet,
  activeRoute,
  language,
  activeView,
  onReportHere,
  onFindRouteFromHere,
  onOpenAlertModal,
  onOfficerDispatch
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const glowLayerRef = useRef<L.LayerGroup | null>(null);
  const polylinesLayerRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  const t = translations[language];

  // Helper: compute bounding box of all streets
  const getAllStreetsBounds = () => {
    const allCoords: [number, number][] = [];
    streets.forEach((s) => allCoords.push(...s.coordinates));
    return L.latLngBounds(allCoords);
  };

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [21.1410, 79.0920],
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    // Standard OpenStreetMap tiles (reliable, free, no API key required)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Zoom controls at top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Layer groups for dynamic rendering (glow underneath, core lines on top)
    glowLayerRef.current = L.layerGroup().addTo(map);
    polylinesLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);

    // Draw Nag River natural waterway reference line (prominent deep blue channel)
    const riverGlow = L.polyline(nagRiverWaterwayCoordinates, {
      color: '#0284c7',
      weight: 14,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    const riverPolyline = L.polyline(nagRiverWaterwayCoordinates, {
      color: '#0369a1',
      weight: 6,
      opacity: 0.9,
      dashArray: '8, 8',
      lineCap: 'round'
    }).addTo(map);

    riverPolyline.bindTooltip(
      `<div class="font-bold text-xs text-sky-900 bg-white/95 px-2 py-1 rounded shadow-md border border-sky-300">
        🌊 Nag River Natural Basin / नाग नदी
      </div>`,
      { sticky: true }
    );

    // Initial fit bounds so ALL streets are immediately visible on screen!
    const allBounds = getAllStreetsBounds();
    map.fitBounds(allBounds, { padding: [40, 40], maxZoom: 15 });

    // Invalidate size to guarantee no grey tiles in any container
    setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(allBounds, { padding: [40, 40], maxZoom: 15 });
    }, 250);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update street polylines and markers whenever streets, language, or activeView changes
  useEffect(() => {
    if (!mapInstanceRef.current || !polylinesLayerRef.current || !glowLayerRef.current || !markersLayerRef.current) return;

    glowLayerRef.current.clearLayers();
    polylinesLayerRef.current.clearLayers();
    markersLayerRef.current.clearLayers();

    // High-visibility neon color palette for flood heatmap aesthetic
    const riskColors = {
      safe: '#10b981',    // Vivid Emerald Green
      watch: '#f59e0b',   // Bright Amber Yellow
      high: '#f97316',    // High-Intensity Orange
      severe: '#ef4444'   // Crimson Signal Red
    };

    // 1. Render Street Segments with 2-layer Heatmap Glow
    streets.forEach((street) => {
      const isSelected = selectedStreet?.id === street.id;
      const color = riskColors[street.riskLevel];

      // Layer 1: Ambient Heatmap Glow Halo (Thick buffer around each lane)
      const glowWeight = isSelected ? 28 : street.riskLevel === 'severe' ? 24 : 20;
      const glowOpacity = isSelected ? 0.65 : street.riskLevel === 'severe' ? 0.45 : 0.35;

      const glowLine = L.polyline(street.coordinates, {
        color,
        weight: glowWeight,
        opacity: glowOpacity,
        lineCap: 'round',
        lineJoin: 'round',
        className: street.riskLevel === 'severe' ? 'animate-pulse' : undefined
      });
      glowLine.on('click', () => {
        onSelectStreet(street);
      });
      glowLayerRef.current?.addLayer(glowLine);

      // Layer 2: Core Vibrant Solid Line (Thick, crisp, and vivid)
      const coreWeight = isSelected ? 14 : street.riskLevel === 'severe' ? 11 : 9;
      const coreOpacity = 0.98;

      // If selected, add an outer white highlight ring beneath core
      if (isSelected) {
        const selectionRing = L.polyline(street.coordinates, {
          color: '#ffffff',
          weight: coreWeight + 6,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round'
        });
        polylinesLayerRef.current?.addLayer(selectionRing);
      }

      const corePolyline = L.polyline(street.coordinates, {
        color,
        weight: coreWeight,
        opacity: coreOpacity,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: street.isExitBlocked ? '12, 8' : undefined
      });

      // Localized name and tooltips
      const displayName =
        language === 'hi' ? street.nameHi : language === 'mr' ? street.nameMr : street.name;
      const depthInfo = t.depthLevels[street.currentDepth];
      const riskInfo = t.riskLevels[street.riskLevel];

      // Rich hover tooltip with colored badge
      corePolyline.bindTooltip(
        `<div class="px-2.5 py-1.5 text-xs bg-slate-900 text-white rounded-xl shadow-lg border border-slate-700">
          <div class="font-bold text-sm text-white">${displayName}</div>
          <div class="flex items-center gap-1.5 mt-0.5 text-xs font-semibold" style="color: ${color}">
            <span class="w-2.5 h-2.5 rounded-full inline-block" style="background-color: ${color}"></span>
            <span>${riskInfo.label} · ${depthInfo.title} (${depthInfo.depthCm})</span>
          </div>
          ${street.isExitBlocked ? '<div class="text-[10px] font-bold text-red-400 mt-1">🚫 EXIT BLOCKED</div>' : ''}
        </div>`,
        { sticky: true, direction: 'top' }
      );

      // Interactive Click Popup with action buttons
      const popupDiv = document.createElement('div');
      popupDiv.className = 'p-3 text-slate-800 text-xs min-w-[250px] max-w-[290px]';
      popupDiv.innerHTML = `
        <div class="flex items-start justify-between gap-2 border-b pb-2 mb-2">
          <div>
            <div class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">${street.ward}</div>
            <h4 class="font-bold text-sm text-slate-900 leading-tight">${displayName}</h4>
          </div>
          <span class="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sm" style="background-color: ${color}">
            ${street.riskLevel}
          </span>
        </div>
        <div class="space-y-1.5 mb-3">
          <div class="flex items-center justify-between text-slate-700 bg-slate-50 p-1.5 rounded-lg">
            <span class="font-medium">Water Depth:</span>
            <span class="font-extrabold text-slate-900">${depthInfo.title} (${depthInfo.depthCm})</span>
          </div>
          <div class="flex items-center justify-between text-slate-700">
            <span class="font-medium">Exit Status:</span>
            <span class="font-bold ${street.isExitBlocked ? 'text-red-600' : 'text-emerald-700'}">
              ${street.isExitBlocked ? '🚫 Blocked / Closed' : '✅ Open / Passable'}
            </span>
          </div>
          ${street.dispatchStatus !== 'none' ? `
            <div class="flex items-center justify-between text-blue-800 font-bold bg-blue-50 px-2 py-1.5 rounded-lg border border-blue-200">
              <span>NMC Relief:</span>
              <span>${street.dispatchStatus === 'pump_dispatched' ? '🚜 Pump Active' : street.dispatchStatus === 'boat_dispatched' ? '🚤 Rescue Boat Active' : 'Officer Team Onsite'}</span>
            </div>
          ` : ''}
          <div class="text-[11px] text-slate-500 italic mt-1">${street.notes}</div>
        </div>
        <div class="grid grid-cols-2 gap-1.5 pt-1 border-t">
          <button id="btn-report-${street.id}" class="py-2 px-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-center transition shadow-sm">
            ⚠️ Report Here
          </button>
          <button id="btn-route-${street.id}" class="py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center transition shadow-sm">
            🧭 Safe Route
          </button>
          <button id="btn-alert-${street.id}" class="col-span-2 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-center transition">
            📲 WhatsApp Alert
          </button>
          ${activeView === 'officer' ? `
            <button id="btn-pump-${street.id}" class="py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-center text-[10px]">
              🚜 Dispatch Pump
            </button>
            <button id="btn-boat-${street.id}" class="py-1.5 px-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-center text-[10px]">
              🚤 Dispatch Boat
            </button>
          ` : ''}
        </div>
      `;

      corePolyline.bindPopup(popupDiv);

      corePolyline.on('popupopen', () => {
        onSelectStreet(street);
        const reportBtn = document.getElementById(`btn-report-${street.id}`);
        const routeBtn = document.getElementById(`btn-route-${street.id}`);
        const alertBtn = document.getElementById(`btn-alert-${street.id}`);
        const pumpBtn = document.getElementById(`btn-pump-${street.id}`);
        const boatBtn = document.getElementById(`btn-boat-${street.id}`);

        reportBtn?.addEventListener('click', () => {
          mapInstanceRef.current?.closePopup();
          onReportHere(street);
        });
        routeBtn?.addEventListener('click', () => {
          mapInstanceRef.current?.closePopup();
          onFindRouteFromHere(street);
        });
        alertBtn?.addEventListener('click', () => {
          mapInstanceRef.current?.closePopup();
          onOpenAlertModal(street);
        });
        pumpBtn?.addEventListener('click', () => {
          onOfficerDispatch(street.id, 'pump_dispatched');
          mapInstanceRef.current?.closePopup();
        });
        boatBtn?.addEventListener('click', () => {
          onOfficerDispatch(street.id, 'boat_dispatched');
          mapInstanceRef.current?.closePopup();
        });
      });

      corePolyline.on('click', () => {
        onSelectStreet(street);
      });

      polylinesLayerRef.current?.addLayer(corePolyline);

      // 2. Add visual warning badges on key points (blocked exits or deep water)
      const midPoint = street.coordinates[Math.floor(street.coordinates.length / 2)];

      if (street.isExitBlocked) {
        const blockedIcon = L.divIcon({
          className: 'custom-blocked-icon',
          html: `<div class="w-8 h-8 rounded-full bg-red-600 border-2 border-white text-white flex items-center justify-center font-bold text-xs shadow-xl animate-bounce" title="Exit Blocked">🚫</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        const marker = L.marker(midPoint, { icon: blockedIcon });
        marker.bindTooltip(`<b>EXIT BLOCKED</b>: ${displayName}`);
        marker.on('click', () => onSelectStreet(street));
        markersLayerRef.current?.addLayer(marker);
      } else if (street.currentDepth >= 3) {
        const deepIcon = L.divIcon({
          className: 'custom-deep-icon',
          html: `<div class="w-7 h-7 rounded-full bg-orange-600 border-2 border-white text-white flex items-center justify-center font-bold text-xs shadow-lg animate-flood-pulse" title="Severe Water Depth">🌊</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        const marker = L.marker(midPoint, { icon: deepIcon });
        marker.bindTooltip(`<b>${depthInfo.title} (${depthInfo.depthCm})</b>: ${displayName}`);
        marker.on('click', () => onSelectStreet(street));
        markersLayerRef.current?.addLayer(marker);
      }

      // Add officer dispatch badge if active
      if (street.dispatchStatus === 'pump_dispatched') {
        const pumpIcon = L.divIcon({
          className: 'custom-pump-icon',
          html: `<div class="w-9 h-9 rounded-full bg-blue-600 border-2 border-white text-white flex items-center justify-center font-bold text-sm shadow-xl" title="Active Dewatering Pump">🚜</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });
        const marker = L.marker(street.coordinates[0], { icon: pumpIcon });
        marker.bindTooltip(`<b>Active Dewatering Pump</b>: ${displayName}`);
        markersLayerRef.current?.addLayer(marker);
      } else if (street.dispatchStatus === 'boat_dispatched') {
        const boatIcon = L.divIcon({
          className: 'custom-boat-icon',
          html: `<div class="w-9 h-9 rounded-full bg-sky-700 border-2 border-white text-white flex items-center justify-center font-bold text-sm shadow-xl" title="Rescue Boat Dispatched">🚤</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });
        const marker = L.marker(street.coordinates[0], { icon: boatIcon });
        marker.bindTooltip(`<b>Rescue Boat Dispatched</b>: ${displayName}`);
        markersLayerRef.current?.addLayer(marker);
      }
    });

    // 3. Render Emergency Shelters
    shelters.forEach((shelter) => {
      const shelterDisplayName =
        language === 'hi' ? shelter.nameHi : language === 'mr' ? shelter.nameMr : shelter.name;

      const shelterIcon = L.divIcon({
        className: 'custom-shelter-icon',
        html: `<div class="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded-full border-2 border-white shadow-xl text-xs font-extrabold whitespace-nowrap cursor-pointer transition">
          <span>🏛️</span>
          <span class="max-w-[130px] truncate">${shelterDisplayName.split(' ')[0]} Camp</span>
        </div>`,
        iconSize: [120, 32],
        iconAnchor: [60, 16]
      });

      const shelterMarker = L.marker(shelter.coordinates, { icon: shelterIcon });
      shelterMarker.bindPopup(`
        <div class="p-2.5 text-slate-800 text-xs">
          <div class="text-[10px] text-emerald-700 font-bold uppercase">Emergency Safe Shelter</div>
          <h4 class="font-bold text-sm text-slate-900 mb-1">${shelterDisplayName}</h4>
          <div class="text-slate-600 mb-1">Capacity: <b>${shelter.capacity - shelter.currentOccupancy}</b> beds free (Occupied: ${shelter.currentOccupancy}/${shelter.capacity})</div>
          <div class="text-slate-600 mb-2">Ward: ${shelter.ward} · Tel: ${shelter.contactNumber}</div>
          <div class="text-[11px] text-slate-500 mb-2">Facilities: ${shelter.facilities.join(' · ')}</div>
          <button id="shelter-route-btn-${shelter.id}" class="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-sm">
            🧭 Route to this Shelter
          </button>
        </div>
      `);

      shelterMarker.on('popupopen', () => {
        const btn = document.getElementById(`shelter-route-btn-${shelter.id}`);
        btn?.addEventListener('click', () => {
          if (selectedStreet) {
            onFindRouteFromHere(selectedStreet);
          }
          mapInstanceRef.current?.closePopup();
        });
      });

      markersLayerRef.current?.addLayer(shelterMarker);
    });

  }, [streets, shelters, selectedStreet, language, activeView, t]);

  // Update Safe Route Layer when activeRoute changes
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerRef.current) return;

    routeLayerRef.current.clearLayers();

    if (activeRoute) {
      // Glow underlay for safe route
      L.polyline(activeRoute.pathCoordinates, {
        color: '#10b981',
        weight: 18,
        opacity: 0.4,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(routeLayerRef.current);

      // Core neon safe evacuation line
      const routePolyline = L.polyline(activeRoute.pathCoordinates, {
        color: '#059669',
        weight: 9,
        opacity: 1.0,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: '10, 10'
      }).addTo(routeLayerRef.current);

      // Start pin
      L.marker(activeRoute.pathCoordinates[0], {
        icon: L.divIcon({
          html: `<div class="w-8 h-8 rounded-full bg-blue-600 border-2 border-white text-white flex items-center justify-center font-bold text-xs shadow-lg">🚶</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })
      }).bindTooltip('<b>Your Safe Start Point</b>').addTo(routeLayerRef.current);

      // Fit map bounds to show full route
      const bounds = routePolyline.getBounds();
      mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    }
  }, [activeRoute]);

  // Handler to center and fit all flood risk lanes on screen
  const handleFitAllLanes = () => {
    if (mapInstanceRef.current) {
      const bounds = getAllStreetsBounds();
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  };

  // Counts by risk color
  const severeCount = streets.filter((s) => s.riskLevel === 'severe').length;
  const highCount = streets.filter((s) => s.riskLevel === 'high').length;
  const watchCount = streets.filter((s) => s.riskLevel === 'watch').length;
  const safeCount = streets.filter((s) => s.riskLevel === 'safe').length;

  return (
    <div className="relative w-full h-full min-h-[450px]">
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Top Controls: Fit All Lanes & Heatmap Summary Badge */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleFitAllLanes}
          className="bg-white/95 hover:bg-white text-slate-900 text-xs font-bold px-3.5 py-2.5 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-2 transition active:scale-95"
          title="Zoom to see all flood risk streets across Nagpur"
        >
          <Maximize2 className="w-4 h-4 text-blue-600" />
          <span>Show All 22 Lanes</span>
        </button>

        {/* Heatmap Legend Card */}
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-200/90 text-xs text-slate-800">
          <div className="font-extrabold text-[11px] text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between gap-2">
            <span>Flood Heatmap</span>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
              22 Monitored
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-4 h-2 rounded-full bg-red-500 shadow-sm inline-block"></span>
                <span className="text-xs font-bold text-red-700">Severe Danger</span>
              </div>
              <span className="text-xs font-extrabold text-red-600 tabular-nums">{severeCount} lanes</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-4 h-2 rounded-full bg-orange-500 shadow-sm inline-block"></span>
                <span className="text-xs font-bold text-orange-700">High Risk (Knee)</span>
              </div>
              <span className="text-xs font-extrabold text-orange-600 tabular-nums">{highCount} lanes</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-4 h-2 rounded-full bg-amber-500 shadow-sm inline-block"></span>
                <span className="text-xs font-bold text-amber-700">Watch (Ankle)</span>
              </div>
              <span className="text-xs font-extrabold text-amber-600 tabular-nums">{watchCount} lanes</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-4 h-2 rounded-full bg-emerald-500 shadow-sm inline-block"></span>
                <span className="text-xs font-bold text-emerald-700">Safe / Open</span>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 tabular-nums">{safeCount} lanes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Simulation Disclaimer Banner */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 backdrop-blur-md text-amber-300 text-[11px] font-semibold px-4 py-1.5 rounded-full shadow-lg border border-amber-500/30 whitespace-nowrap pointer-events-none">
        ⚠️ {t.simulatedDataNotice} · Nag River Pilot Wards
      </div>
    </div>
  );
};
