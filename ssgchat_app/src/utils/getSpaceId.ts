export const getSpaceId = (lat: number, lng: number): string => {
  const latFixed = lat.toFixed(3);
  const lngFixed = lng.toFixed(3);
  return `${latFixed}_${lngFixed}`;
};
