import { Language, WaterDepthLevel, HazardType, RiskLevel } from '../types/flood';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  pilotLocation: string;
  simulatedDataNotice: string;
  residentView: string;
  officerDashboard: string;
  reportFloodButton: string;
  findSafeRouteButton: string;
  viewAlertsButton: string;
  audioGuideButton: string;
  soundPlaying: string;
  soundStopped: string;
  close: string;
  cancel: string;
  submit: string;
  shareWhatsApp: string;
  copySms: string;
  smsCopied: string;
  
  // Risk Levels
  riskLevels: Record<RiskLevel, { label: string; description: string; advice: string }>;

  // Depth Levels
  depthLevels: Record<WaterDepthLevel, {
    title: string;
    depthCm: string;
    desc: string;
    canWalk: boolean;
    vehicleStatus: string;
  }>;

  // Hazards
  hazards: Record<HazardType, { label: string; desc: string }>;

  // Officer Actions
  sendPump: string;
  sendBoat: string;
  clearExit: string;
  pumpSentNotice: string;
  boatSentNotice: string;
  actionCompletedNotice: string;
  priorityStreets: string;
  wardFilter: string;
  allWards: string;
  imdRainfallIndex: string;
  rainIntensity: string;
  heavyRainfallWarning: string;

  // Report Form
  reportTitle: string;
  reportSubtitle: string;
  selectLocationStep: string;
  selectDepthStep: string;
  addPhotoStep: string;
  markHazardsStep: string;
  uploadPhotoPlaceholder: string;
  orChooseSamplePhoto: string;
  additionalNotes: string;
  submitSuccessToast: string;

  // Safe Route
  safeRouteTitle: string;
  safeRouteSubtitle: string;
  nearestShelter: string;
  walkTime: string;
  distance: string;
  avoidsDangerousLanes: string;
  startWalkingGuidance: string;
  noShelterNeeded: string;

  // Alerts
  laneAlertTitle: string;
  laneAlertSubtitle: string;
  currentLaneRisk: string;
  whatsappMessageTemplate: (street: string, ward: string, depth: string, risk: string, exitBlocked: boolean, shelter: string) => string;
  smsMessageTemplate: (street: string, depth: string, risk: string, exitBlocked: boolean, shelter: string) => string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: "Nukkad Flood Map",
    tagline: "Hyperlocal Lane-Level Flood Resilience",
    pilotLocation: "Nag River Basin, Nagpur",
    simulatedDataNotice: "Demo data: simulated for hackathon prototype (Nag River pilot wards)",
    residentView: "Resident Map",
    officerDashboard: "Ward Officer Dashboard",
    reportFloodButton: "Report Water Level",
    findSafeRouteButton: "Find Safe Route",
    viewAlertsButton: "Gali Alerts & WhatsApp",
    audioGuideButton: "Voice Audio (Listen)",
    soundPlaying: "Playing Audio...",
    soundStopped: "Audio Readout",
    close: "Close",
    cancel: "Cancel",
    submit: "Submit Report",
    shareWhatsApp: "Share on WhatsApp",
    copySms: "Copy SMS Alert",
    smsCopied: "SMS Copied to Clipboard!",

    riskLevels: {
      safe: {
        label: "Safe (Green)",
        description: "Dry or minimal surface runoff",
        advice: "Lane is walkable and open to all vehicles."
      },
      watch: {
        label: "Watch (Yellow)",
        description: "Waterlogging at ankle height (~15 cm)",
        advice: "Slow traffic. Walk with care near drains."
      },
      high: {
        label: "High Risk (Orange)",
        description: "Knee-deep water (~45 cm)",
        advice: "Avoid two-wheelers. Children & elders stay indoors."
      },
      severe: {
        label: "Severe Danger (Red)",
        description: "Waist-deep water or blocked exit (~90 cm+)",
        advice: "Evacuate immediately via safe route! Do not enter."
      }
    },

    depthLevels: {
      0: {
        title: "Dry Road",
        depthCm: "0 cm",
        desc: "Normal road conditions, no waterlogging.",
        canWalk: true,
        vehicleStatus: "All vehicles safe"
      },
      1: {
        title: "Ankle Deep",
        depthCm: "~15 cm",
        desc: "Water up to ankles. Shoes wet, puddles forming.",
        canWalk: true,
        vehicleStatus: "Cars and bikes can pass slowly"
      },
      2: {
        title: "Knee Deep",
        depthCm: "~45 cm",
        desc: "Water reaches knees. Walking difficult against current.",
        canWalk: false,
        vehicleStatus: "Bikes stall; only heavy vehicles"
      },
      3: {
        title: "Waist Deep",
        depthCm: "~90 cm",
        desc: "Water up to waist. Strong force, entering homes.",
        canWalk: false,
        vehicleStatus: "Vehicles completely blocked"
      },
      4: {
        title: "Chest Deep",
        depthCm: "~130 cm",
        desc: "Water at chest height. Extreme risk of drowning.",
        canWalk: false,
        vehicleStatus: "Only rescue boats can navigate"
      },
      5: {
        title: "Above Head",
        depthCm: "180+ cm",
        desc: "Submerged ground floor. Life-threatening flood.",
        canWalk: false,
        vehicleStatus: "Disaster evacuation zone"
      }
    },

    hazards: {
      exit_blocked: {
        label: "Exit Blocked",
        desc: "Pulia or lane exit barricaded or submerged"
      },
      open_manhole: {
        label: "Open Manhole / Drain",
        desc: "Uncovered sewer or drain opening hidden under water"
      },
      electric_hazard: {
        label: "Electric Wire Hazard",
        desc: "Downed transformer wire or live electric pillar in water"
      },
      fast_current: {
        label: "Fast River Current",
        desc: "Torrential water surge flowing towards river basin"
      }
    },

    sendPump: "Dispatch Pump",
    sendBoat: "Dispatch Rescue Boat",
    clearExit: "Mark Cleared",
    pumpSentNotice: "Dewatering high-capacity pump dispatched to lane!",
    boatSentNotice: "NDRF / Municipal Rescue Boat deployed to location!",
    actionCompletedNotice: "Hazard marked resolved by Ward Officer.",
    priorityStreets: "Priority Action Ranked List",
    wardFilter: "Filter Ward",
    allWards: "All Pilot Wards",
    imdRainfallIndex: "IMD Nagpur Radar Index",
    rainIntensity: "68 mm/hr (Intense Cloudburst)",
    heavyRainfallWarning: "Nag River level +1.4m above critical threshold.",

    reportTitle: "Report Water Level in Your Gali",
    reportSubtitle: "Your report immediately alerts neighbors & municipal rescue teams",
    selectLocationStep: "1. Select Lane / Street",
    selectDepthStep: "2. How deep is the water?",
    addPhotoStep: "3. Upload Photo (Optional)",
    markHazardsStep: "4. Any Danger Spots?",
    uploadPhotoPlaceholder: "Tap to snap photo or select file",
    orChooseSamplePhoto: "Or tap realistic photo sample:",
    additionalNotes: "Landmark notes (e.g., near temple / transformer):",
    submitSuccessToast: "Report submitted! Lane risk score and color updated on map.",

    safeRouteTitle: "Safe Evacuation Route",
    safeRouteSubtitle: "Route calculated avoiding all red/severe and blocked lanes",
    nearestShelter: "Nearest Emergency Shelter",
    walkTime: "Walking Time",
    distance: "Distance",
    avoidsDangerousLanes: "Bypasses all severe flood zones and open drains.",
    startWalkingGuidance: "Follow the glowing green line on the map. Keep phone dry.",
    noShelterNeeded: "Lane is currently safe. Stay alert to updates.",

    laneAlertTitle: "Hyperlocal Nukkad Alert",
    laneAlertSubtitle: "Ready-to-share message for WhatsApp community groups and SMS",
    currentLaneRisk: "Current Street Condition",
    whatsappMessageTemplate: (street, ward, depth, risk, exitBlocked, shelter) =>
      `🌊 *NUKKAD FLOOD ALERT - NAGPUR* 🚨\n\n` +
      `📍 *Lane:* ${street} (${ward})\n` +
      `⚠️ *Risk Status:* ${risk}\n` +
      `💧 *Water Depth:* ${depth}\n` +
      `${exitBlocked ? `🚫 *EXIT STATUS: BLOCKED / NOT PASSABLE*\n` : `✅ *Exit Status: Accessible with caution*\n`}` +
      `🏠 *Nearest Safe Shelter:* ${shelter}\n\n` +
      `ℹ️ Avoid low-lying river drains. Help elders & children first.\n` +
      `🗺️ Live Map: https://nukkadflood.nagpur.gov.in/demo\n` +
      `_Issued by Ward Disaster Management Cell_`,
    smsMessageTemplate: (street, depth, risk, exitBlocked, shelter) =>
      `ALERT: ${street} is at ${risk.toUpperCase()} risk with ${depth} water. ${exitBlocked ? 'EXIT BLOCKED! ' : ''}Nearest safe shelter: ${shelter}. Check safe route immediately.`
  },

  hi: {
    appName: "नुक्कड़ बाढ़ मानचित्र",
    tagline: "नागपुर नाग नदी क्षेत्र - गली स्तर पर बाढ़ सुरक्षा",
    pilotLocation: "नाग नदी बेसिन, नागपुर",
    simulatedDataNotice: "डेमो डेटा: हैकाथॉन प्रोटोटाइप हेतु अनुकरण (Demo data: simulated for hackathon prototype) · नाग नदी",
    residentView: "नागरिक नक्शा",
    officerDashboard: "वार्ड अधिकारी डैशबोर्ड",
    reportFloodButton: "पानी का स्तर रिपोर्ट करें",
    findSafeRouteButton: "सुरक्षित रास्ता खोजें",
    viewAlertsButton: "गली चेतावनी और व्हाट्सएप",
    audioGuideButton: "आवाज़ में सुनें (ऑडियो)",
    soundPlaying: "ऑडियो बज रहा है...",
    soundStopped: "आवाज़ में सुनें",
    close: "बंद करें",
    cancel: "रद्द करें",
    submit: "रिपोर्ट भेजें",
    shareWhatsApp: "व्हाट्सएप पर भेजें",
    copySms: "एसएमएस कॉपी करें",
    smsCopied: "एसएमएस कॉपी हो गया!",

    riskLevels: {
      safe: {
        label: "सुरक्षित (हरा)",
        description: "सूखा या सामान्य पानी",
        advice: "रास्ता खुला है, पैदल और वाहन सुरक्षित निकल सकते हैं।"
      },
      watch: {
        label: "सतर्क (पीला)",
        description: "टखने तक पानी (~15 सेमी)",
        advice: "सावधानी से चलें। नाले के किनारों से दूर रहें।"
      },
      high: {
        label: "खतरा (नारंगी)",
        description: "घुटनों तक पानी (~45 सेमी)",
        advice: "दोपहिया वाहन न ले जाएँ। बच्चे व बुजुर्ग बाहर न निकलें।"
      },
      severe: {
        label: "गंभीर संकट (लाल)",
        description: "कमर से ऊपर पानी या रास्ता बंद (~90+ सेमी)",
        advice: "तुरंत सुरक्षित स्थान पर जाएँ! इस रास्ते में बिल्कुल न जाएँ।"
      }
    },

    depthLevels: {
      0: {
        title: "सूखा रास्ता",
        depthCm: "0 सेमी",
        desc: "रास्ता बिल्कुल साफ है, पानी नहीं भरा है।",
        canWalk: true,
        vehicleStatus: "सभी वाहन जा सकते हैं"
      },
      1: {
        title: "टखने तक पानी",
        depthCm: "~15 सेमी",
        desc: "जूते भीग रहे हैं, छोटे गड्ढों में पानी है।",
        canWalk: true,
        vehicleStatus: "गाड़ियाँ धीमी गति से निकल सकती हैं"
      },
      2: {
        title: "घुटनों तक पानी",
        depthCm: "~45 सेमी",
        desc: "घुटने डूब रहे हैं, पैदल चलना कठिन हो रहा है।",
        canWalk: false,
        vehicleStatus: "बाइक बंद पड़ सकती है, केवल बड़े वाहन"
      },
      3: {
        title: "कमर तक पानी",
        depthCm: "~90 सेमी",
        desc: "कमर तक तेज बहाव, घरों में पानी घुस रहा है।",
        canWalk: false,
        vehicleStatus: "गाड़ियों का आवागमन पूरी तरह बंद"
      },
      4: {
        title: "छाती तक पानी",
        depthCm: "~130 सेमी",
        desc: "छाती तक पानी। बहने का भारी खतरा।",
        canWalk: false,
        vehicleStatus: "केवल बचाव नाव ही चल सकती है"
      },
      5: {
        title: "सिर से ऊपर",
        depthCm: "180+ सेमी",
        desc: "मकानों की पहली मंजिल डूब रही है। जीवन को भारी संकट।",
        canWalk: false,
        vehicleStatus: "तत्काल नाव द्वारा राहत आवश्यक"
      }
    },

    hazards: {
      exit_blocked: {
        label: "रास्ता बंद / पुलिया डूबी",
        desc: "गली से बाहर निकलने का रास्ता पानी या मलबे से बंद है"
      },
      open_manhole: {
        label: "खुला गटर / नाला",
        desc: "पानी में डूबा हुआ खुला नाला जिसमें गिरने का डर है"
      },
      electric_hazard: {
        label: "बिजली का खुला तार",
        desc: "पानी में गिरा बिजली का खंभा या तार, करंट का खतरा"
      },
      fast_current: {
        label: "तेज बहाव",
        desc: "नाग नदी की ओर बहुत तेज गति से बहता पानी"
      }
    },

    sendPump: "पंप भेजें",
    sendBoat: "बचाव नाव भेजें",
    clearExit: "रास्ता साफ चिन्हित करें",
    pumpSentNotice: "इस गली के लिए पानी निकालने का भारी पंप रवाना किया गया!",
    boatSentNotice: "एनडीआरएफ / नगर पालिका बचाव नाव रवाना!",
    actionCompletedNotice: "अधिकारी द्वारा खतरे की स्थिति सामान्य दर्ज की गई।",
    priorityStreets: "वार्ड प्राथमिकता सूची (सर्वाधिक प्रभावित)",
    wardFilter: "वार्ड चुनें",
    allWards: "सभी प्रायोगिक वार्ड",
    imdRainfallIndex: "मौसम विभाग (आईएमडी) नागपुर सूचकांक",
    rainIntensity: "68 मिमी/घंटा (अत्यधिक मूसलाधार बारिश)",
    heavyRainfallWarning: "नाग नदी का जलस्तर खतरे के निशान से +1.4 मीटर ऊपर।",

    reportTitle: "अपनी गली में पानी का स्तर बताएं",
    reportSubtitle: "आपकी सूचना से पड़ोसियों और राहत दल को तुरंत मदद मिलेगी",
    selectLocationStep: "1. अपनी गली या सड़क चुनें",
    selectDepthStep: "2. पानी कितना गहरा है?",
    addPhotoStep: "3. फोटो जोड़ें (यदि संभव हो)",
    markHazardsStep: "4. क्या कोई खतरा है?",
    uploadPhotoPlaceholder: "फोटो खींचें या गैलरी से चुनें",
    orChooseSamplePhoto: "या यहाँ से नमूना फोटो चुनें:",
    additionalNotes: "पहचान स्थल (जैसे: मंदिर के पास, ट्रांसफार्मर):",
    submitSuccessToast: "रिपोर्ट दर्ज हो गई! नक्शे पर गली का रंग तुरंत अपडेट कर दिया गया है।",

    safeRouteTitle: "सुरक्षित निकासी मार्ग",
    safeRouteSubtitle: "लाल/खतरनाक गलियों और डूबे रास्तों से बचकर बनाया गया मार्ग",
    nearestShelter: "निकटतम सुरक्षित राहत शिविर",
    walkTime: "पैदल समय",
    distance: "दूरी",
    avoidsDangerousLanes: "सभी गहरे पानी और खुले नालों वाले रास्तों से बचाता है।",
    startWalkingGuidance: "नक्शे पर चमकती हरी लाइन के पीछे-पीछे चलें। फोन सुरक्षित रखें।",
    noShelterNeeded: "आपकी गली अभी सुरक्षित है। सतर्क रहें।",

    laneAlertTitle: "हाइपरलोकल नुक्कड़ चेतावनी",
    laneAlertSubtitle: "व्हाट्सएप ग्रुप और एसएमएस में भेजने हेतु तैयार संदेश",
    currentLaneRisk: "सड़क की वर्तमान स्थिति",
    whatsappMessageTemplate: (street, ward, depth, risk, exitBlocked, shelter) =>
      `🌊 *नुक्कड़ बाढ़ चेतावनी - नागपुर* 🚨\n\n` +
      `📍 *गली/सड़क:* ${street} (${ward})\n` +
      `⚠️ *स्थिति:* ${risk}\n` +
      `💧 *पानी का स्तर:* ${depth}\n` +
      `${exitBlocked ? `🚫 *रास्ता बंद है! बाहर न निकलें!*\n` : `✅ *रास्ता खुला है (सावधानी बरतें)*\n`}` +
      `🏠 *निकटतम सुरक्षित आश्रय:* ${shelter}\n\n` +
      `ℹ️ नाले के पास न जाएँ। बुजुर्गों और बच्चों की पहले मदद करें।\n` +
      `🗺️ लाइव नक्शा: https://nukkadflood.nagpur.gov.in/demo\n` +
      `_नागपुर आपदा नियंत्रण कक्ष द्वारा जारी_`,
    smsMessageTemplate: (street, depth, risk, exitBlocked, shelter) =>
      `बाढ़ चेतावनी: ${street} में ${risk} स्तर का पानी (${depth}) भर गया है। ${exitBlocked ? 'रास्ता बंद है! ' : ''}सुरक्षित आश्रय: ${shelter}। तुरंत सुरक्षित मार्ग अपनाएँ।`
  },

  mr: {
    appName: "नुक्कड पूर नकाशा",
    tagline: "नागपूर नाग नदी परिसर - गल्ली पातळीवर पूर सुरक्षा",
    pilotLocation: "नाग नदी खोरे, नागपूर",
    simulatedDataNotice: "डेमो माहिती: हॅकाथॉन प्रोटोटाइपसाठी सिम्युलेटेड (Demo data: simulated for hackathon prototype) · नाग नदी",
    residentView: "नागरिक नकाशा",
    officerDashboard: "प्रभाग अधिकारी डॅशबोर्ड",
    reportFloodButton: "पाण्याची पातळी नोंदवा",
    findSafeRouteButton: "सुरक्षित मार्ग शोधा",
    viewAlertsButton: "गल्ली सूचना व व्हॉट्सॲप",
    audioGuideButton: "आवाजात ऐका (ऑडिओ)",
    soundPlaying: "ऑडिओ वाजत आहे...",
    soundStopped: "आवाजात ऐका",
    close: "बंद करा",
    cancel: "रद्द करा",
    submit: "माहिती पाठवा",
    shareWhatsApp: "व्हॉट्सॲपवर पाठवा",
    copySms: "एसएमएस कॉपी करा",
    smsCopied: "एसएमएस कॉपी झाला!",

    riskLevels: {
      safe: {
        label: "सुरक्षित (हिरवा)",
        description: "कोरडा किंवा सामान्य पाण्याचा प्रवाह",
        advice: "रस्ता खुला आहे, पायी आणि वाहनांसाठी सुरक्षित आहे."
      },
      watch: {
        label: "सतर्क (पिवळा)",
        description: "घोट्यापर्यंत पाणी (~15 सेमी)",
        advice: "काळजीपूर्वक चाला. नाल्यांच्या कडेला जाऊ नका."
      },
      high: {
        label: "धोका (केशरी)",
        description: "गुडघ्यापर्यंत पाणी (~45 सेमी)",
        advice: "दुचाकी नेऊ नका. लहान मुले व वृद्धांनी घरातच थांबावे."
      },
      severe: {
        label: "गंभीर धोका (लाल)",
        description: "कमरेच्या वर पाणी किंवा रस्ता बंद (~90+ सेमी)",
        advice: "त्वरित सुरक्षित ठिकाणी स्थलांतर करा! या रस्त्याने जाऊ नका."
      }
    },

    depthLevels: {
      0: {
        title: "कोरडा रस्ता",
        depthCm: "0 सेमी",
        desc: "रस्ता पूर्णपणे मोकळा आहे, पाणी साचलेले नाही.",
        canWalk: true,
        vehicleStatus: "सर्व वाहनांसाठी सुरक्षित"
      },
      1: {
        title: "घोट्यापर्यंत पाणी",
        depthCm: "~15 सेमी",
        desc: "पावले बुडत आहेत, लहान डबकी साचली आहेत.",
        canWalk: true,
        vehicleStatus: "वाहने हळूहळू जाऊ शकतात"
      },
      2: {
        title: "गुडघ्यापर्यंत पाणी",
        depthCm: "~45 सेमी",
        desc: "पाणी गुडघ्यापर्यंत पोहोचले आहे, चालणे कठीण होत आहे.",
        canWalk: false,
        vehicleStatus: "दुचाकी बंद पडू शकते, केवळ मोठी वाहने"
      },
      3: {
        title: "कमरेपर्यंत पाणी",
        depthCm: "~90 सेमी",
        desc: "कमरेएवढे पाणी आणि जोरदार प्रवाह, घरांत पाणी शिरत आहे.",
        canWalk: false,
        vehicleStatus: "वाहतूक पूर्णपणे ठप्प"
      },
      4: {
        title: "छातीपर्यंत पाणी",
        depthCm: "~130 सेमी",
        desc: "छातीपर्यंत पाणी. वाहून जाण्याचा प्रचंड धोका.",
        canWalk: false,
        vehicleStatus: "केवळ बचाव नौकाच जाऊ शकते"
      },
      5: {
        title: "डोक्यावरून पाणी",
        depthCm: "180+ सेमी",
        desc: "घरांचे पहिले मजले पाण्याखाली. जीवितास गंभीर धोका.",
        canWalk: false,
        vehicleStatus: "तातडीने नौकेद्वारे सुटका आवश्यक"
      }
    },

    hazards: {
      exit_blocked: {
        label: "रस्ता बंद / पूल बुडाला",
        desc: "गल्लीतून बाहेर पडण्याचा मुख्य मार्ग पाण्यामुळे पूर्णपणे बंद आहे"
      },
      open_manhole: {
        label: "उघडी गटार / नाला",
        desc: "पाण्याखाली लपलेली उघडी गटार ज्यामध्ये पडण्याचा मोठा धोका आहे"
      },
      electric_hazard: {
        label: "विजेची उघडी तार",
        desc: "पाण्यात पडलेली विजेची तार किंवा पोल, शॉक लागण्याचा धोका"
      },
      fast_current: {
        label: "वेगवान प्रवाह",
        desc: "नाग नदीकडे वेगाने वाहणारा पाण्याचा तीव्र लोंढा"
      }
    },

    sendPump: "पंप रवाना करा",
    sendBoat: "बचाव नौका पाठवा",
    clearExit: "रस्ता मोकळा नोंदवा",
    pumpSentNotice: "या गल्लीसाठी पाणी उपसा करणारा मोठा पंप रवाना केला आहे!",
    boatSentNotice: "आपत्ती निवारण बचाव नौका घटनास्थळी रवाना!",
    actionCompletedNotice: "अधिकाऱ्याने धोका निवारण झाल्याची नोंद केली.",
    priorityStreets: "प्रभाग प्राधान्य यादी (सर्वात बाधित)",
    wardFilter: "प्रभाग निवडा",
    allWards: "सर्व प्रायोगिक प्रभाग",
    imdRainfallIndex: "हवामान विभाग (IMD) नागपूर निर्देशांक",
    rainIntensity: "68 मिमी/तास (मुसळधार ढगफुटीसदृश पाऊस)",
    heavyRainfallWarning: "नाग नदीची पाणी पातळी धोक्याच्या चिन्हापेक्षा +1.4 मीटर जास्त.",

    reportTitle: "आपल्या गल्लीतील पाण्याची पातळी नोंदवा",
    reportSubtitle: "आपल्या एका माहितीने शेजाऱ्यांना आणि बचाव पथकाला तातडीने मदत मिळेल",
    selectLocationStep: "1. आपली गल्ली किंवा रस्ता निवडा",
    selectDepthStep: "2. पाणी किती खोल आहे?",
    addPhotoStep: "3. फोटो जोडा (शक्य असल्यास)",
    markHazardsStep: "4. रस्त्यात काही धोका आहे का?",
    uploadPhotoPlaceholder: "फोटो काढा किंवा गॅलरीतून निवडा",
    orChooseSamplePhoto: "किंवा नमुना फोटो निवडा:",
    additionalNotes: "ओळख ठिकाण (उदा. मंदिराशेजारी, ट्रान्सफॉर्मरजवळ):",
    submitSuccessToast: "माहिती नोंदवली गेली! नकाशावर रस्त्याचा रंग तत्काळ बदलला आहे.",

    safeRouteTitle: "सुरक्षित स्थलांतर मार्ग",
    safeRouteSubtitle: "लाल/धोकादायक गल्ल्या व तुंबलेले रस्ते वगळून तयार केलेला मार्ग",
    nearestShelter: "जवळचे सुरक्षित निवार केंद्र",
    walkTime: "चालण्याची वेळ",
    distance: "अंतर",
    avoidsDangerousLanes: "सर्व खोल पाणी आणि उघड्या गटारांचे धोके टाळतो.",
    startWalkingGuidance: "नकाशावरील चमकत्या हिरव्या रेषेचे अनुसरण करा. फोन कोरडा ठेवा.",
    noShelterNeeded: "आपली गल्ली सध्या सुरक्षित आहे. सावध रहा.",

    laneAlertTitle: "स्थानिक नुक्कड इशारा",
    laneAlertSubtitle: "व्हॉट्सॲप ग्रुप आणि एसएमएससाठी तयार संदेश",
    currentLaneRisk: "रस्त्याची सद्यस्थिती",
    whatsappMessageTemplate: (street, ward, depth, risk, exitBlocked, shelter) =>
      `🌊 *नुक्कड पूर इशारा - नागपूर* 🚨\n\n` +
      `📍 *गल्ली/रस्ता:* ${street} (${ward})\n` +
      `⚠️ *स्थिती:* ${risk}\n` +
      `💧 *पाण्याची पातळी:* ${depth}\n` +
      `${exitBlocked ? `🚫 *रस्ता बंद आहे! बाहेर पडू नका!*\n` : `✅ *रस्ता खुला आहे (काळजीपूर्वक जा)*\n`}` +
      `🏠 *जवळचे सुरक्षित निवार केंद्र:* ${shelter}\n\n` +
      `ℹ️ नाल्यांच्या जवळ जाऊ नका. लहान मुले व वृद्धांना प्रथम सुरक्षित करा.\n` +
      `🗺️ थेट नकाशा: https://nukkadflood.nagpur.gov.in/demo\n` +
      `_नागपूर आपत्ती व्यवस्थापन कक्षाकडून जारी_`,
    smsMessageTemplate: (street, depth, risk, exitBlocked, shelter) =>
      `पूर इशारा: ${street} मध्ये ${risk} पातळीचे पाणी (${depth}) साचले आहे. ${exitBlocked ? 'रस्ता बंद आहे! ' : ''}सुरक्षित निवार केंद्र: ${shelter}. त्वरित सुरक्षित मार्ग वापरा.`
  }
};
