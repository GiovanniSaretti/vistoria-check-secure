/**
 * Canonical JSON String Generator
 * 
 * Generates a deterministic JSON string by:
 * 1. Recursively sorting all object keys
 * 2. Maintaining array order
 * 3. Ensuring consistent serialization for hash generation
 */

export function canonicalJSONString(obj: unknown): string {
  const sort = (value: any): any => {
    if (Array.isArray(value)) {
      return value.map(sort)
    }
    
    if (value && typeof value === 'object' && value.constructor === Object) {
      const sorted: Record<string, any> = {}
      const keys = Object.keys(value).sort()
      
      for (const key of keys) {
        sorted[key] = sort(value[key])
      }
      
      return sorted
    }
    
    return value
  }

  return JSON.stringify(sort(obj))
}

/**
 * Generate canonical JSON for inspection data
 * Used for PDF hash generation and verification
 */
export function generateInspectionCanonicalData(inspection: any): any {
  // Remove volatile fields that shouldn't affect the hash
  const canonicalData = {
    id: inspection.id,
    number: inspection.number,
    title: inspection.title,
    template_id: inspection.template_id,
    organization_id: inspection.organization_id,
    context_json: inspection.context_json,
    data_json: inspection.data_json,
    status: inspection.status,
    created_at: inspection.created_at,
    signed_at: inspection.signed_at,
    // Include related data
    items: inspection.inspection_items || [],
    photos: (inspection.photos || []).map((photo: any) => ({
      id: photo.id,
      item_path: photo.item_path,
      file_url: photo.file_url,
      filename: photo.filename,
      created_at: photo.created_at
    })),
    signatures: (inspection.signatures || []).map((sig: any) => ({
      id: sig.id,
      role: sig.role,
      signed_by_name: sig.signed_by_name,
      signed_at: sig.signed_at,
      file_url: sig.file_url
    }))
  }

  return canonicalData
}