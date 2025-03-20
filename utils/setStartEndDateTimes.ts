/**
 * Appends start of day time (12am)
 * @param str ISO string
 * @returns 
 */
export function appendStartTime(str: string): string {
  return str.split('T')[0] + 'T00:00:00.000Z'
}

/**
 * Appends end of day time (11:59pm)
 * @param str ISO string
 * @returns 
 */
export function appendEndTime(str: string): string {
  return str.split('T')[0] + 'T23:59:59.999Z'
}
