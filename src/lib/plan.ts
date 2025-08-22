export type Plan = 'free'|'payg'|'starter'|'pro'|'business'
export function canGeneratePdf(plan: Plan, pdfCount: number){
  return plan==='free' ? pdfCount < 3 : true
}
export function maxActivePublicLinks(plan: Plan){
  return plan==='free' ? 1 : 999
}