// canonical.ts
export function canonicalJSONString(obj:any){const s=(v:any)=>Array.isArray(v)?v.map(s):v&&typeof v==='object'?Object.keys(v).sort().reduce((a,k)=>(a[k]=s(v[k]),a),{}):v;return JSON.stringify(s(obj))}

export function generateInspectionCanonicalData(inspection: any) {
  return {
    id: inspection.id,
    number: inspection.number,
    title: inspection.title,
    status: inspection.status,
    created_at: inspection.created_at,
    context_json: inspection.context_json,
    data_json: inspection.data_json,
    template_id: inspection.template_id,
    organization_id: inspection.organization_id,
    inspection_items: inspection.inspection_items?.map((item: any) => ({
      id: item.id,
      path: item.path,
      status: item.status,
      notes: item.notes,
      created_at: item.created_at
    })) || [],
    signatures: inspection.signatures?.map((sig: any) => ({
      id: sig.id,
      role: sig.role,
      signed_by_name: sig.signed_by_name,
      signed_at: sig.signed_at
    })) || []
  }
}

