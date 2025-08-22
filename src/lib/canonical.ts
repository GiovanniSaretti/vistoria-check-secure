// canonical.ts
export function canonicalJSONString(obj:any){const s=(v:any)=>Array.isArray(v)?v.map(s):v&&typeof v==='object'?Object.keys(v).sort().reduce((a,k)=>(a[k]=s(v[k]),a),{}):v;return JSON.stringify(s(obj))}

