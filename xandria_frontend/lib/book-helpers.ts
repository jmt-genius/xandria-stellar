/**
 * Title-based book matching utilities.
 *
 * All hardcoded data is keyed by normalized title so it works regardless
 * of what numeric ID the on-chain contract assigns.
 */

export function normalizeTitle(title: string): string {
  return title.toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Look up a value in a title-keyed map. Tries exact match first,
 * then falls back to "starts-with" matching in both directions
 * (useful if the contract title is a shorter/longer variant).
 */
export function matchTitle<T>(
  title: string,
  map: Record<string, T>,
): T | undefined {
  const normalized = normalizeTitle(title);
  if (map[normalized]) return map[normalized];

  for (const [key, value] of Object.entries(map)) {
    if (normalized.startsWith(key) || key.startsWith(normalized)) {
      return value;
    }
  }
  return undefined;
}
