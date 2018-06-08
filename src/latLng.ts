const project = (lat, lng, tileSize) => {
  const lt = lat - 41.3447089189291;
  const lg = lng - 2.10726442487254;
  const siny = Math.sin((lt * Math.PI) / 180);
  const siny2 = Math.min(Math.max(siny, -0.9999), 0.9999);

  return [
    tileSize * (0.5 + lg / 360),
    tileSize * (0.5 - Math.log((1 + siny2) / (1 - siny)) / (4 * Math.PI))
  ];
};

export const toPixel = ({ lat, lng }, scale = 1, zoom = 1) => {
  const [x, y] = project(lat, lng, 250);
  const s = scale << zoom;
  return [Math.floor(x * s), Math.floor(y * s)];
};
