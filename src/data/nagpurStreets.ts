import { StreetSegment, Shelter, RiskLevel, WaterDepthLevel } from '../types/flood';

// Realistic Nag River natural waterway path curving through Nagpur pilot wards
export const nagRiverWaterwayCoordinates: [number, number][] = [
  [21.1312, 79.0558], // Ambazari overflow weir
  [21.1328, 79.0605], // Dharampeth canal entry
  [21.1345, 79.0652], // Near Shankar Nagar garden
  [21.1362, 79.0700], // Ramdaspeth western curve
  [21.1378, 79.0745], // Behind Hotel Centre Point
  [21.1395, 79.0788], // Dhantoli border culvert
  [21.1412, 79.0832], // Yashwant stadium backside
  [21.1432, 79.0868], // Panchsheel bridge
  [21.1448, 79.0898], // Sitabuldi pulia choke point
  [21.1442, 79.0942], // Approaching Baidyanath
  [21.1428, 79.0980], // Baidyanath chowk culvert
  [21.1412, 79.1030], // Mokshadham ghat riverbend
  [21.1422, 79.1085], // Ashok Nagar-Reshimbagh bridge
  [21.1438, 79.1145], // Reshimbagh nullah confluence
  [21.1455, 79.1195], // Kotwali ward border
  [21.1472, 79.1265], // Towards Pardi & Bhandewadi
];

// Helper to determine risk level from baseline, depth, exit blockage, and reports
export function calculateRisk(
  baseline: number,
  depth: WaterDepthLevel,
  isExitBlocked: boolean,
  reportCount: number
): RiskLevel {
  if (isExitBlocked || depth >= 3) {
    return 'severe';
  }
  const depthWeight = depth / 5.0;
  const crowdBonus = Math.min(0.25, Math.log10(1 + reportCount) * 0.2);
  const compositeScore = (baseline * 0.35) + (depthWeight * 0.5) + crowdBonus;

  if (compositeScore >= 0.65 || depth >= 3) return 'severe';
  if (compositeScore >= 0.42 || depth === 2) return 'high';
  if (compositeScore >= 0.22 || depth === 1) return 'watch';
  return 'safe';
}

export const initialStreets: StreetSegment[] = [
  // SEVERE / RED LANES (Waist-deep ~90cm+ or blocked choke points)
  {
    id: 'nag-1',
    name: 'Ramdaspeth Nullah Canal Road',
    nameHi: 'रामदासपेठ नाला नहर मार्ग',
    nameMr: 'रामदासपेठ नाला कालवा रस्ता',
    ward: 'Ward 17 - Ramdaspeth',
    wardNumber: 17,
    coordinates: [
      [21.1342, 79.0692],
      [21.1355, 79.0718],
      [21.1368, 79.0738],
      [21.1374, 79.0758],
      [21.1382, 79.0776],
      [21.1390, 79.0798]
    ],
    elevationMeters: 308,
    proximityToRiverMeters: 18,
    baselineRisk: 0.85,
    currentDepth: 3,
    riskLevel: 'severe',
    isExitBlocked: true,
    hazards: ['exit_blocked', 'fast_current'],
    reportCount: 14,
    lastUpdated: '4 min ago',
    dispatchStatus: 'none',
    notes: 'Low-lying culvert overflow near hotel cluster. Exit barricaded.'
  },
  {
    id: 'nag-2',
    name: 'Anand Nagar Slum Main Gali',
    nameHi: 'आनंद नगर बस्ती मुख्य गली',
    nameMr: 'आनंद नगर झोपडपट्टी मुख्य गल्ली',
    ward: 'Ward 14 - Sitabuldi',
    wardNumber: 14,
    coordinates: [
      [21.1418, 79.0825],
      [21.1428, 79.0844],
      [21.1436, 79.0862],
      [21.1444, 79.0882],
      [21.1450, 79.0902]
    ],
    elevationMeters: 306,
    proximityToRiverMeters: 12,
    baselineRisk: 0.90,
    currentDepth: 4,
    riskLevel: 'severe',
    isExitBlocked: true,
    hazards: ['exit_blocked', 'open_manhole', 'electric_hazard'],
    reportCount: 22,
    lastUpdated: '2 min ago',
    dispatchStatus: 'boat_dispatched',
    notes: 'Severe flooding along river retaining wall. Rescue boats deployed.'
  },
  {
    id: 'nag-5',
    name: 'Mokshadham Ghat Low-Lying Ghat Road',
    nameHi: 'मोक्षधाम घाट निचला किनारा मार्ग',
    nameMr: 'मोक्षधाम घाट सखल किनारा रस्ता',
    ward: 'Ward 28 - Ashok Nagar',
    wardNumber: 28,
    coordinates: [
      [21.1388, 79.0988],
      [21.1398, 79.1012],
      [21.1408, 79.1034],
      [21.1416, 79.1054],
      [21.1424, 79.1075]
    ],
    elevationMeters: 305,
    proximityToRiverMeters: 10,
    baselineRisk: 0.88,
    currentDepth: 3,
    riskLevel: 'severe',
    isExitBlocked: true,
    hazards: ['exit_blocked', 'fast_current'],
    reportCount: 16,
    lastUpdated: '5 min ago',
    dispatchStatus: 'none',
    notes: 'River backflow entered cremation ghat approach. Road impassable.'
  },
  {
    id: 'nag-7',
    name: 'Reshimbagh Nullah Vasti Inner Lane',
    nameHi: 'रेशीमबाग नाला बस्ती भीतरी लेन',
    nameMr: 'रेशीमबाग नाला वस्ती आतील गल्ली',
    ward: 'Ward 34 - Reshimbagh',
    wardNumber: 34,
    coordinates: [
      [21.1402, 79.1082],
      [21.1412, 79.1110],
      [21.1422, 79.1135],
      [21.1430, 79.1160],
      [21.1438, 79.1182]
    ],
    elevationMeters: 307,
    proximityToRiverMeters: 20,
    baselineRisk: 0.80,
    currentDepth: 3,
    riskLevel: 'severe',
    isExitBlocked: false,
    hazards: ['electric_hazard', 'open_manhole'],
    reportCount: 19,
    lastUpdated: '7 min ago',
    dispatchStatus: 'none',
    notes: 'Low elevation colony. Water entered 35 houses. Electric supply tripped.'
  },
  {
    id: 'nag-15',
    name: 'Yashwant Stadium Nullah Underpass Lane',
    nameHi: 'यशवंत स्टेडियम नाला अंडरपास मार्ग',
    nameMr: 'यशवंत स्टेडियम नाला भुयारी गल्ली',
    ward: 'Ward 22 - Dhantoli',
    wardNumber: 22,
    coordinates: [
      [21.1352, 79.0838],
      [21.1368, 79.0856],
      [21.1384, 79.0872],
      [21.1400, 79.0886],
      [21.1415, 79.0902]
    ],
    elevationMeters: 307,
    proximityToRiverMeters: 35,
    baselineRisk: 0.78,
    currentDepth: 3,
    riskLevel: 'severe',
    isExitBlocked: true,
    hazards: ['exit_blocked', 'fast_current'],
    reportCount: 15,
    lastUpdated: '10 min ago',
    dispatchStatus: 'none',
    notes: 'Underpass filled with 3.5 ft water. Police placed safety barricades.'
  },
  {
    id: 'nag-18',
    name: 'Subhash Nagar Culvert Bridge Lane',
    nameHi: 'सुभाष नगर पुलिया संपर्क मार्ग',
    nameMr: 'सुभाष नगर पूल जोड गल्ली',
    ward: 'Ward 28 - Ashok Nagar',
    wardNumber: 28,
    coordinates: [
      [21.1365, 79.1002],
      [21.1378, 79.1026],
      [21.1392, 79.1048],
      [21.1404, 79.1068],
      [21.1415, 79.1088]
    ],
    elevationMeters: 306,
    proximityToRiverMeters: 22,
    baselineRisk: 0.82,
    currentDepth: 3,
    riskLevel: 'severe',
    isExitBlocked: true,
    hazards: ['exit_blocked', 'open_manhole'],
    reportCount: 17,
    lastUpdated: '6 min ago',
    dispatchStatus: 'boat_dispatched',
    notes: 'Culvert submerged by 1 meter. Evacuation in progress.'
  },
  {
    id: 'nag-19',
    name: 'Ashok Nagar Riverbend Lane',
    nameHi: 'अशोक नगर नदी मोड़ मार्ग',
    nameMr: 'अशोक नगर नदी वळण गल्ली',
    ward: 'Ward 28 - Ashok Nagar',
    wardNumber: 28,
    coordinates: [
      [21.1372, 79.0954],
      [21.1385, 79.0978],
      [21.1398, 79.1002],
      [21.1408, 79.1024],
      [21.1418, 79.1042]
    ],
    elevationMeters: 305,
    proximityToRiverMeters: 14,
    baselineRisk: 0.86,
    currentDepth: 4,
    riskLevel: 'severe',
    isExitBlocked: true,
    hazards: ['exit_blocked', 'fast_current'],
    reportCount: 18,
    lastUpdated: '3 min ago',
    dispatchStatus: 'none',
    notes: 'Backwater surge from Nag River. Exit impassable.'
  },

  // HIGH RISK / ORANGE LANES (Knee Deep ~45cm)
  {
    id: 'nag-3',
    name: 'Sitabuldi Bridge Lower Approach Road',
    nameHi: 'सीताबर्डी पुलिया निचला मार्ग',
    nameMr: 'सीताबर्डी पूल खालचा पोहोच रस्ता',
    ward: 'Ward 14 - Sitabuldi',
    wardNumber: 14,
    coordinates: [
      [21.1444, 79.0872],
      [21.1456, 79.0898],
      [21.1468, 79.0920],
      [21.1478, 79.0942],
      [21.1485, 79.0958]
    ],
    elevationMeters: 310,
    proximityToRiverMeters: 25,
    baselineRisk: 0.72,
    currentDepth: 2,
    riskLevel: 'high',
    isExitBlocked: false,
    hazards: ['fast_current'],
    reportCount: 9,
    lastUpdated: '12 min ago',
    dispatchStatus: 'pump_dispatched',
    notes: 'Water rushing from flyover gradient. High capacity dewatering pump running.'
  },
  {
    id: 'nag-4',
    name: 'Dhantoli Hospital Lane (Near Nag River)',
    nameHi: 'धंतोली अस्पताल गली (नाग नदी निकट)',
    nameMr: 'धंतोली रुग्णालय गल्ली (नाग नदीजवळ)',
    ward: 'Ward 22 - Dhantoli',
    wardNumber: 22,
    coordinates: [
      [21.1378, 79.0788],
      [21.1392, 79.0814],
      [21.1405, 79.0838],
      [21.1418, 79.0858],
      [21.1428, 79.0875]
    ],
    elevationMeters: 311,
    proximityToRiverMeters: 30,
    baselineRisk: 0.65,
    currentDepth: 2,
    riskLevel: 'high',
    isExitBlocked: false,
    hazards: ['open_manhole'],
    reportCount: 11,
    lastUpdated: '8 min ago',
    dispatchStatus: 'none',
    notes: 'Ambulance corridor slow moving. Open manhole flagged with bamboo marker.'
  },
  {
    id: 'nag-6',
    name: 'Baidyanath Chowk Subway & Crossway',
    nameHi: 'बैद्यनाथ चौक सबवे एवं क्रासिंग मार्ग',
    nameMr: 'बैद्यनाथ चौक भुयारी मार्ग व रस्ता',
    ward: 'Ward 19 - Ganeshpeth',
    wardNumber: 19,
    coordinates: [
      [21.1412, 79.0934],
      [21.1425, 79.0958],
      [21.1436, 79.0982],
      [21.1448, 79.1008],
      [21.1458, 79.1028]
    ],
    elevationMeters: 307,
    proximityToRiverMeters: 40,
    baselineRisk: 0.70,
    currentDepth: 2,
    riskLevel: 'high',
    isExitBlocked: false,
    hazards: ['fast_current'],
    reportCount: 8,
    lastUpdated: '15 min ago',
    dispatchStatus: 'pump_dispatched',
    notes: 'Subway waterlogged to 2.5 ft. Diverting traffic towards Great Nag Road.'
  },
  {
    id: 'nag-17',
    name: 'Khamla Nullah Junction Culvert',
    nameHi: 'खामला नाला संगम पुलिया मार्ग',
    nameMr: 'खामला नाला संगम पूल रस्ता',
    ward: 'Ward 17 - Ramdaspeth',
    wardNumber: 17,
    coordinates: [
      [21.1324, 79.0718],
      [21.1340, 79.0744],
      [21.1354, 79.0768],
      [21.1368, 79.0792],
      [21.1380, 79.0812]
    ],
    elevationMeters: 309,
    proximityToRiverMeters: 45,
    baselineRisk: 0.68,
    currentDepth: 2,
    riskLevel: 'high',
    isExitBlocked: false,
    hazards: ['fast_current'],
    reportCount: 10,
    lastUpdated: '14 min ago',
    dispatchStatus: 'none',
    notes: 'Khamla feeder overflow mixing into Nag River. Pedestrians avoid.'
  },
  {
    id: 'nag-20',
    name: 'Tilak Nagar River Crossing',
    nameHi: 'तिलक नगर नदी क्रासिंग लेन',
    nameMr: 'टिळक नगर नदी ओलांडणी गल्ली',
    ward: 'Ward 11 - Dharampeth',
    wardNumber: 11,
    coordinates: [
      [21.1344, 79.0624],
      [21.1358, 79.0652],
      [21.1370, 79.0680],
      [21.1382, 79.0706],
      [21.1394, 79.0730]
    ],
    elevationMeters: 312,
    proximityToRiverMeters: 40,
    baselineRisk: 0.60,
    currentDepth: 2,
    riskLevel: 'high',
    isExitBlocked: false,
    hazards: ['fast_current'],
    reportCount: 7,
    lastUpdated: '11 min ago',
    dispatchStatus: 'none',
    notes: 'Turbulent flow near culvert mouth. Two-wheelers stalled.'
  },

  // WATCH / YELLOW LANES (Ankle Deep ~15cm)
  {
    id: 'nag-8',
    name: 'Mahal Kotwali Old Market Street',
    nameHi: 'महाल कोतवाली पुराना बाजार मार्ग',
    nameMr: 'महाल कोतवाली जुना बाजार रस्ता',
    ward: 'Ward 31 - Mahal',
    wardNumber: 31,
    coordinates: [
      [21.1440, 79.1158],
      [21.1454, 79.1186],
      [21.1466, 79.1214],
      [21.1478, 79.1242],
      [21.1488, 79.1265]
    ],
    elevationMeters: 312,
    proximityToRiverMeters: 65,
    baselineRisk: 0.45,
    currentDepth: 1,
    riskLevel: 'watch',
    isExitBlocked: false,
    hazards: [],
    reportCount: 5,
    lastUpdated: '20 min ago',
    dispatchStatus: 'none',
    notes: 'Clogged stormwater chambers. Ankle deep water on shops.'
  },
  {
    id: 'nag-9',
    name: 'Dharampeth Canal Link Road',
    nameHi: 'धरमपेठ नहर संपर्क मार्ग',
    nameMr: 'धरमपेठ कालवा जोड रस्ता',
    ward: 'Ward 11 - Dharampeth',
    wardNumber: 11,
    coordinates: [
      [21.1315, 79.0602],
      [21.1332, 79.0632],
      [21.1348, 79.0660],
      [21.1362, 79.0688],
      [21.1374, 79.0712]
    ],
    elevationMeters: 320,
    proximityToRiverMeters: 80,
    baselineRisk: 0.30,
    currentDepth: 1,
    riskLevel: 'watch',
    isExitBlocked: false,
    hazards: [],
    reportCount: 4,
    lastUpdated: '25 min ago',
    dispatchStatus: 'none',
    notes: 'Moderate gradient runoff. Street walkable with caution.'
  },
  {
    id: 'nag-13',
    name: 'Untkhana Medical College Back Road',
    nameHi: 'उंटखाना मेडिकल कॉलेज पिछला मार्ग',
    nameMr: 'उंटखाना मेडिकल कॉलेज मागील रस्ता',
    ward: 'Ward 28 - Ashok Nagar',
    wardNumber: 28,
    coordinates: [
      [21.1346, 79.0930],
      [21.1362, 79.0958],
      [21.1378, 79.0984],
      [21.1394, 79.1008],
      [21.1408, 79.1030]
    ],
    elevationMeters: 314,
    proximityToRiverMeters: 75,
    baselineRisk: 0.38,
    currentDepth: 1,
    riskLevel: 'watch',
    isExitBlocked: false,
    hazards: [],
    reportCount: 6,
    lastUpdated: '18 min ago',
    dispatchStatus: 'none',
    notes: 'Shallow runoff. Suitable for walking if avoiding road shoulders.'
  },
  {
    id: 'nag-16',
    name: 'Ganeshpeth Bus Terminus Approach Lane',
    nameHi: 'गणेशपेठ बस स्टैंड अप्रोच लेन',
    nameMr: 'गणेशपेठ बस स्थानक पोहोच गल्ली',
    ward: 'Ward 19 - Ganeshpeth',
    wardNumber: 19,
    coordinates: [
      [21.1444, 79.0968],
      [21.1460, 79.0998],
      [21.1475, 79.1026],
      [21.1488, 79.1052],
      [21.1498, 79.1072]
    ],
    elevationMeters: 312,
    proximityToRiverMeters: 85,
    baselineRisk: 0.42,
    currentDepth: 1,
    riskLevel: 'watch',
    isExitBlocked: false,
    hazards: [],
    reportCount: 7,
    lastUpdated: '16 min ago',
    dispatchStatus: 'none',
    notes: 'Water draining into main storm drain. Accessible on foot.'
  },
  {
    id: 'nag-21',
    name: 'Jhansi Rani Square Sitabuldi Link',
    nameHi: 'झांसी रानी चौक सीताबर्डी मार्ग',
    nameMr: 'झाशीची राणी चौक सीताबर्डी रस्ता',
    ward: 'Ward 14 - Sitabuldi',
    wardNumber: 14,
    coordinates: [
      [21.1462, 79.0824],
      [21.1472, 79.0852],
      [21.1482, 79.0882],
      [21.1492, 79.0910],
      [21.1502, 79.0934]
    ],
    elevationMeters: 315,
    proximityToRiverMeters: 110,
    baselineRisk: 0.35,
    currentDepth: 1,
    riskLevel: 'watch',
    isExitBlocked: false,
    hazards: [],
    reportCount: 6,
    lastUpdated: '22 min ago',
    dispatchStatus: 'none',
    notes: 'Commercial market runoff. Foot traffic moving steadily.'
  },

  // SAFE / GREEN LANES (Elevated Safe Corridors)
  {
    id: 'nag-10',
    name: 'West High Court Road (Elevated Safe Ridge)',
    nameHi: 'वेस्ट हाई कोर्ट मार्ग (ऊँचा सुरक्षित टीला मार्ग)',
    nameMr: 'वेस्ट हायकोर्ट रस्ता (उंच सुरक्षित टेकाड रस्ता)',
    ward: 'Ward 11 - Dharampeth',
    wardNumber: 11,
    coordinates: [
      [21.1322, 79.0664],
      [21.1356, 79.0682],
      [21.1390, 79.0702],
      [21.1424, 79.0722],
      [21.1458, 79.0740],
      [21.1485, 79.0756]
    ],
    elevationMeters: 328,
    proximityToRiverMeters: 180,
    baselineRisk: 0.10,
    currentDepth: 0,
    riskLevel: 'safe',
    isExitBlocked: false,
    hazards: [],
    reportCount: 2,
    lastUpdated: '35 min ago',
    dispatchStatus: 'none',
    notes: 'High ridge arterial road. Free of flooding. Designated primary safe corridor.'
  },
  {
    id: 'nag-11',
    name: 'Wardha Road - Panchsheel Square Elevated Corridor',
    nameHi: 'वर्धा मार्ग - पंचशील चौक सुरक्षित मार्ग',
    nameMr: 'वर्धा रस्ता - पंचशील चौक सुरक्षित कॉरिडॉर',
    ward: 'Ward 14 - Sitabuldi',
    wardNumber: 14,
    coordinates: [
      [21.1348, 79.0802],
      [21.1382, 79.0824],
      [21.1418, 79.0848],
      [21.1454, 79.0872],
      [21.1488, 79.0896],
      [21.1518, 79.0918]
    ],
    elevationMeters: 324,
    proximityToRiverMeters: 140,
    baselineRisk: 0.15,
    currentDepth: 0,
    riskLevel: 'safe',
    isExitBlocked: false,
    hazards: [],
    reportCount: 1,
    lastUpdated: '40 min ago',
    dispatchStatus: 'none',
    notes: 'Main elevated highway strip. Fully safe and clear for emergency transport.'
  },
  {
    id: 'nag-12',
    name: 'Central Avenue - Ganeshpeth Flyover Highway',
    nameHi: 'सेंट्रल एवेन्यू - गणेशपेठ फ्लाईओवर राजमार्ग',
    nameMr: 'सेंट्रल एव्हेन्यू - गणेशपेठ उड्डाणपूल महामार्ग',
    ward: 'Ward 19 - Ganeshpeth',
    wardNumber: 19,
    coordinates: [
      [21.1472, 79.0928],
      [21.1488, 79.0988],
      [21.1504, 79.1054],
      [21.1518, 79.1120],
      [21.1530, 79.1186]
    ],
    elevationMeters: 322,
    proximityToRiverMeters: 250,
    baselineRisk: 0.12,
    currentDepth: 0,
    riskLevel: 'safe',
    isExitBlocked: false,
    hazards: [],
    reportCount: 1,
    lastUpdated: '45 min ago',
    dispatchStatus: 'none',
    notes: 'Wide 4-lane elevated artery. Dry and safely connected to hospital zones.'
  },
  {
    id: 'nag-14',
    name: 'Suresh Bhat Sabhagruh High Ridge Road',
    nameHi: 'सुरेश भट सभागृह टीला मार्ग (रेशीमबाग)',
    nameMr: 'सुरेश भट सभागृह टेकडी रस्ता (रेशीमबाग)',
    ward: 'Ward 34 - Reshimbagh',
    wardNumber: 34,
    coordinates: [
      [21.1368, 79.1064],
      [21.1384, 79.1102],
      [21.1402, 79.1142],
      [21.1418, 79.1182],
      [21.1432, 79.1220]
    ],
    elevationMeters: 326,
    proximityToRiverMeters: 190,
    baselineRisk: 0.12,
    currentDepth: 0,
    riskLevel: 'safe',
    isExitBlocked: false,
    hazards: [],
    reportCount: 2,
    lastUpdated: '30 min ago',
    dispatchStatus: 'none',
    notes: 'Safe elevated access to Suresh Bhat Relief Camp and food distribution.'
  },
  {
    id: 'nag-22',
    name: 'Great Nag Road High Embankment Bypass',
    nameHi: 'ग्रेट नाग रोड ऊँचा सुरक्षित बायपास',
    nameMr: 'ग्रेट नाग रोड उंच सुरक्षित बायपास',
    ward: 'Ward 28 - Ashok Nagar',
    wardNumber: 28,
    coordinates: [
      [21.1334, 79.0882],
      [21.1352, 79.0934],
      [21.1370, 79.0988],
      [21.1388, 79.1044],
      [21.1408, 79.1102],
      [21.1424, 79.1158]
    ],
    elevationMeters: 321,
    proximityToRiverMeters: 160,
    baselineRisk: 0.14,
    currentDepth: 0,
    riskLevel: 'safe',
    isExitBlocked: false,
    hazards: [],
    reportCount: 3,
    lastUpdated: '28 min ago',
    dispatchStatus: 'none',
    notes: 'Broad elevated embankment road above flood plane. Emergency vehicles active.'
  }
];

export const emergencyShelters: Shelter[] = [
  {
    id: 'shelter-1',
    name: 'Sitabuldi Municipal Relief Hall',
    nameHi: 'सीताबर्डी नगर पालिका राहत भवन',
    nameMr: 'सीताबर्डी महानगरपालिका निवारण केंद्र',
    coordinates: [21.1472, 79.0860],
    capacity: 450,
    currentOccupancy: 190,
    facilities: ['Clean Drinking Water', 'Community Kitchen (Langar)', 'Medical Team / First Aid', 'Dry Clothes', 'Phone Charging'],
    contactNumber: '+91 712 2567001',
    ward: 'Ward 14 - Sitabuldi'
  },
  {
    id: 'shelter-2',
    name: 'Suresh Bhat Sabhagruh Relief Camp',
    nameHi: 'सुरेश भट सभागृह विशाल राहत शिविर',
    nameMr: 'सुरेश भट सभागृह आपत्ती निवारण छावणी',
    coordinates: [21.1398, 79.1135],
    capacity: 1200,
    currentOccupancy: 420,
    facilities: ['24/7 Doctors & Medicines', 'Hot Meals & Baby Food', 'Elevated Safe Ground', 'Ambulance On Standby', 'Sanitation Kits'],
    contactNumber: '+91 712 2567002',
    ward: 'Ward 34 - Reshimbagh'
  },
  {
    id: 'shelter-3',
    name: 'Dharampeth High School Camp',
    nameHi: 'धरमपेठ उच्च विद्यालय बाढ़ शिविर',
    nameMr: 'धरमपेठ हायस्कूल पूर निवारण केंद्र',
    coordinates: [21.1365, 79.0665],
    capacity: 600,
    currentOccupancy: 140,
    facilities: ['Clean Restrooms', 'Dry Rations & Water', 'First Aid Center', 'Generator Backup'],
    contactNumber: '+91 712 2567003',
    ward: 'Ward 11 - Dharampeth'
  },
  {
    id: 'shelter-4',
    name: 'Dhantoli Sports Complex Shelter',
    nameHi: 'धंतोली क्रीड़ा संकुल राहत केंद्र',
    nameMr: 'धंतोली क्रीडा संकुल निवारण शिबीर',
    coordinates: [21.1375, 79.0845],
    capacity: 500,
    currentOccupancy: 210,
    facilities: ['Emergency Beds', 'Free Meals', 'Pediatric Care', 'Safe Drinking Water'],
    contactNumber: '+91 712 2567004',
    ward: 'Ward 22 - Dhantoli'
  },
  {
    id: 'shelter-5',
    name: 'Baidyanath Community Relief Bhavan',
    nameHi: 'बैद्यनाथ सामुदायिक राहत भवन',
    nameMr: 'बैद्यनाथ समाज मंदिर निवारण केंद्र',
    coordinates: [21.1470, 79.0985],
    capacity: 350,
    currentOccupancy: 165,
    facilities: ['Clean Water', 'Ayurvedic & Allopathic Aid', 'Blankets & Sleeping Mats'],
    contactNumber: '+91 712 2567005',
    ward: 'Ward 19 - Ganeshpeth'
  }
];

export const sampleFloodPhotos = [
  {
    id: 'photo-1',
    label: 'Knee Deep Waterlogging',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%2364748b"/><stop offset="100%" stop-color="%2394a3b8"/></linearGradient><linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%2378350f"/><stop offset="100%" stop-color="%2392400e"/></linearGradient></defs><rect width="400" height="150" fill="url(%23sky)"/><rect y="150" width="400" height="150" fill="url(%23water)"/><path d="M40 90 L80 90 L80 160 L40 160 Z" fill="%23475569"/><path d="M120 70 L200 70 L200 170 L120 170 Z" fill="%23334155"/><circle cx="280" cy="180" r="14" fill="%23f59e0b"/><rect x="275" y="194" width="10" height="40" fill="%23d97706"/><circle cx="20" cy="220" r="8" fill="%23ef4444"/><text x="200" y="270" font-family="sans-serif" font-size="14" fill="%23fef08a" text-anchor="middle" font-weight="bold">SAMPLE: Knee-Deep Lane Water (Ramdaspeth)</text></svg>'
  },
  {
    id: 'photo-2',
    label: 'Submerged Culvert / Blocked Exit',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23475569"/><stop offset="100%" stop-color="%2364748b"/></linearGradient><linearGradient id="water2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%239a3412"/><stop offset="100%" stop-color="%237c2d12"/></linearGradient></defs><rect width="400" height="120" fill="url(%23sky2)"/><rect y="120" width="400" height="180" fill="url(%23water2)"/><rect x="100" y="100" width="200" height="30" fill="%23dc2626"/><text x="200" y="122" font-family="sans-serif" font-size="13" fill="%23ffffff" text-anchor="middle" font-weight="bold">EXIT BLOCKED / DANGER</text><text x="200" y="260" font-family="sans-serif" font-size="14" fill="%23ffffff" text-anchor="middle" font-weight="bold">SAMPLE: Culvert Submerged (Anand Nagar)</text></svg>'
  },
  {
    id: 'photo-3',
    label: 'Open Drain Torrent',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%231e293b"/><path d="M0 160 Q100 130 200 170 T400 150 L400 300 L0 300 Z" fill="%230f766e"/><circle cx="210" cy="180" r="28" fill="%23000000" stroke="%23f97316" stroke-width="4"/><text x="210" y="185" font-family="sans-serif" font-size="12" fill="%23ffffff" text-anchor="middle">DRAIN</text><text x="200" y="270" font-family="sans-serif" font-size="14" fill="%235eead4" text-anchor="middle" font-weight="bold">SAMPLE: Open Manhole Whirlpool (Mokshadham)</text></svg>'
  }
];
