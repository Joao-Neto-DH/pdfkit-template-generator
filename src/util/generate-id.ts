export function generateId(totalOfElements: number) {
  return Math.round(Math.random() * 1000 + totalOfElements + 1 + Date.now());
}
