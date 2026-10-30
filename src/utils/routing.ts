import { StreetSegment, Shelter, SafeRoute } from '../types/flood';

export function calculateSafeRoute(
  startStreet: StreetSegment,
  shelter: Shelter,
  allStreets: StreetSegment[]
): SafeRoute {
  // Find safe connecting segments (green or yellow, not blocked)
  const safeConnectors = allStreets.filter(
    s => s.riskLevel !== 'severe' && !s.isExitBlocked
  );

  // Severe streets to avoid
  const avoidedStreets = allStreets.filter(
    s => s.riskLevel === 'severe' || s.isExitBlocked
  );

  // Construct smooth coordinates path:
  // 1. Start point from user's street
  const startCoord = startStreet.coordinates[0];
  // 2. Select 1 or 2 high safe corridor waypoints based on proximity
  const elevatedRidgeStreets = safeConnectors.filter(
    s => s.elevationMeters >= 315
  );

  const waypoints: [number, number][] = [];
  waypoints.push(startCoord);

  // Choose appropriate intermediate safe ridge point
  if (elevatedRidgeStreets.length > 0) {
    // Sort by combined distance to start and shelter
    elevatedRidgeStreets.sort((a, b) => {
      const distA = Math.hypot(a.coordinates[1][0] - startCoord[0], a.coordinates[1][1] - startCoord[1]);
      const distB = Math.hypot(b.coordinates[1][0] - startCoord[0], b.coordinates[1][1] - startCoord[1]);
      return distA - distB;
    });

    const chosenSafe = elevatedRidgeStreets[0];
    waypoints.push(...chosenSafe.coordinates);
  }

  // Final destination shelter
  waypoints.push(shelter.coordinates);

  // Compute realistic distance in meters
  let totalDistanceMeters = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const latDiff = (waypoints[i + 1][0] - waypoints[i][0]) * 111000;
    const lngDiff = (waypoints[i + 1][1] - waypoints[i][1]) * 111000 * Math.cos((waypoints[i][0] * Math.PI) / 180);
    totalDistanceMeters += Math.hypot(latDiff, lngDiff);
  }
  totalDistanceMeters = Math.round(totalDistanceMeters * 1.25); // Account for city street turns
  const estimatedWalkMinutes = Math.max(3, Math.round(totalDistanceMeters / 75)); // ~4.5 km/hr walking

  const instructionsEn = [
    `1. Exit ${startStreet.name} moving towards higher elevation.`,
    `2. Keep away from Nag River retaining wall and storm drains.`,
    `3. Turn onto elevated safe ridge route (avoiding ${avoidedStreets[0]?.name || 'flooded canal'}).`,
    `4. Proceed along high pavement towards ${shelter.name}.`,
    `5. Arrive at ${shelter.name} — register at relief counter for dry rations & medical aid.`
  ];

  const instructionsHi = [
    `१. ${startStreet.nameHi} से ऊँचाई की तरफ निकलें।`,
    `२. नाले और नदी की दीवार से कम से कम ५० मीटर दूर रहें।`,
    `३. मुख्य सुरक्षित मार्ग पर आएँ (${avoidedStreets[0]?.nameHi || 'डूबे नाले'} से बचें)।`,
    `४. ऊँचे फुटपाथ से होते हुए ${shelter.nameHi} की ओर बढ़ें।`,
    `५. ${shelter.nameHi} पहुँचें — राहत काउंटर पर भोजन व प्राथमिक उपचार प्राप्त करें।`
  ];

  const instructionsMr = [
    `१. ${startStreet.nameMr} येथून उंच भागाच्या दिशेने बाहेर पडा.`,
    `२. नाल्यांची कडे आणि नदीच्या संरक्षक भिंतीपासून लांब राहा.`,
    `३. मुख्य उंच सुरक्षित रस्त्यावरून चाला (${avoidedStreets[0]?.nameMr || 'बुडालेला रस्ता'} टाळा).`,
    `४. उंच फूटपाथने ${shelter.nameMr} कडे मार्गक्रमण करा.`,
    `५. ${shelter.nameMr} येथे पोहोचा — मदत केंद्रात नोंदणी करून कोरडे अन्न व उपचार घ्या.`
  ];

  return {
    destinationShelter: shelter,
    startStreet,
    pathCoordinates: waypoints,
    totalDistanceMeters,
    estimatedWalkMinutes,
    avoidedStreetsCount: avoidedStreets.length,
    instructionsEn,
    instructionsHi,
    instructionsMr
  };
}
