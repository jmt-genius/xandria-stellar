export function formatReadingTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

export function formatPrice(price: number): string {
  return price % 1 === 0 ? String(Math.round(price)) : price.toFixed(2);
}
