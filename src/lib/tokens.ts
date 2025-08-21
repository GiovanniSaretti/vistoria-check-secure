/**
 * Generate cryptographically secure random tokens
 */
export function randomToken(length = 32): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Generate a shorter token for public links
 */
export function generatePublicToken(): string {
  return randomToken(16) // 32 character hex string
}

/**
 * Generate a secure token for signatures
 */
export function generateSignatureToken(): string {
  return randomToken(24) // 48 character hex string
}