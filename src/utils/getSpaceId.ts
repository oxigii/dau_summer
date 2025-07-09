export function getSpaceId(lat: number, lon: number): string {
  const roundedLat = lat.toFixed(3);
  const roundedLon = lon.toFixed(3);
  return `space_${roundedLat}_${roundedLon}`;
}
