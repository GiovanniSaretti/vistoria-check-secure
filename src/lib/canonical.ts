export function canonicalJSONString(obj: unknown) {
  const sort = (v: any): any =>
    Array.isArray(v) ? v.map(sort)
    : v && typeof v === 'object'
      ? Object.keys(v).sort().reduce((acc, k) => (acc[k]=sort(v[k]), acc), {} as any)
      : v
  return JSON.stringify(sort(obj))
}

export function generateInspectionCanonicalData(inspection: any) {
  return canonicalJSONString({
    id: inspection.id,
    title: inspection.title,
    status: inspection.status,
    template_data: inspection.template_data,
    user_id: inspection.user_id,
    created_at: inspection.created_at,
    updated_at: inspection.updated_at
  })
}