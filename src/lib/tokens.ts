export function randomToken(len=32) {
  const a = new Uint8Array(len)
  crypto.getRandomValues(a)
  return [...a].map(b=>b.toString(16).padStart(2,'0')).join('')
}