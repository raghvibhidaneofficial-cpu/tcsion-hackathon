export type RiskLevel = 'safe' | 'watch' | 'high' | 'severe';

export type WaterDepthLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type HazardType = 'exit_blocked' | 'open_manhole' | 'electric_hazard' | 'fast_current';

export type DispatchStatus = 'none' | 'pump_dispatched' | 'boat_dispatched' | 'team_on_site';

export interface StreetSegment {
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  ward: string;
  wardNumber: number;
  coordinates: [number, number][]; // Array of [lat, lng]
  elevationMeters: number;
  proximityToRiverMeters: number;
  baselineRisk: number; // 0 to 1
  currentDepth: WaterDepthLevel;
  riskLevel: RiskLevel;
  isExitBlocked: boolean;
  hazards: HazardType[];
  reportCount: number;
  lastUpdated: string;
  dispatchStatus: DispatchStatus;
  notes: string;
}

export interface Shelter {
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  coordinates: [number, number];
  capacity: number;
  currentOccupancy: number;
  facilities: string[];
  contactNumber: string;
  ward: string;
}

export interface CrowdReport {
  id: string;
  streetId: string;
  streetName: string;
  depthLevel: WaterDepthLevel;
  hazards: HazardType[];
  photoUrl?: string;
  notes?: string;
  timestamp: string;
  reportedBy: string;
}

export interface SafeRoute {
  destinationShelter: Shelter;
  startStreet: StreetSegment;
  pathCoordinates: [number, number][];
  totalDistanceMeters: number;
  estimatedWalkMinutes: number;
  avoidedStreetsCount: number;
  instructionsEn: string[];
  instructionsHi: string[];
  instructionsMr: string[];
}

export type Language = 'en' | 'hi' | 'mr';
