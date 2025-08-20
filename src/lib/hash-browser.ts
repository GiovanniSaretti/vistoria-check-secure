/**
 * Browser-compatible SHA-256 hash generation
 * Uses Web Crypto API for secure hashing
 */

export async function sha256HexBrowser(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  
  return hashArray
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Generate hash for inspection data
 */
export async function generateInspectionHash(canonicalJson: string): Promise<string> {
  return await sha256HexBrowser(canonicalJson)
}

/**
 * Verify inspection integrity by comparing hashes
 */
export async function verifyInspectionIntegrity(
  canonicalJson: string, 
  expectedHash: string
): Promise<boolean> {
  const calculatedHash = await generateInspectionHash(canonicalJson)
  return calculatedHash === expectedHash
}