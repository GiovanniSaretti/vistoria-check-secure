export function canonicalJSONString(obj: unknown) {
  const sort = (v: any): any =>
    Array.isArray(v) ? v.map(sort)
    : v && typeof v === 'object'
      ? Object.keys(v).sort().reduce((acc, k) => (acc[k]=sort(v[k]), acc), {} as any)
      : v
  return JSON.stringify(sort(obj))
}