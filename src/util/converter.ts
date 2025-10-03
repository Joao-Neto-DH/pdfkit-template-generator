export function pixelToPoint(px: number) {
  return (px * 72) / 96;
}

export function pointToPixel(pt: number) {
  return (pt * 96) / 72;
}
