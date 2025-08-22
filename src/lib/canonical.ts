// canonical.ts
export function canonicalJSONString(obj:any){const s=(v:any)=>Array.isArray(v)?v.map(s):v&&typeof v==='object'?Object.keys(v).sort().reduce((a,k)=>(a[k]=s(v[k]),a),{}):v;return JSON.stringify(s(obj))}
// hash-browser.ts
export async function sha256HexBrowser(s:string){const b=new TextEncoder().encode(s);const d=await crypto.subtle.digest('SHA-256',b);return [...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,'0')).join('')}
