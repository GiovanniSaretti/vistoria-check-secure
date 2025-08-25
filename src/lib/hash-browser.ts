export async function sha256HexBrowser(s: string) {
  const buf = new TextEncoder().encode(s)
  const digest = await crypto.subtle.digest('SHA-256', buf)
  return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('')
}

export async function generateInspectionHash(canonicalData: string) {
  return await sha256HexBrowser(canonicalData)
}