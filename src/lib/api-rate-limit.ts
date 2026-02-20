const windows = new Map<string, number[]>()

export function checkApiRateLimit(key: string, limit = 10, windowMs = 60000): boolean {
  const now = Date.now()
  const timestamps = (windows.get(key) || []).filter(t => now - t < windowMs)
  if (timestamps.length >= limit) return false
  timestamps.push(now)
  windows.set(key, timestamps)
  return true
}
