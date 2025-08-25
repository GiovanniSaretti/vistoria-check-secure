export type Plan='free'|'payg'|'starter'|'pro'|'business'
export function canGeneratePdf(plan:Plan, count:number){ return plan==='free' ? count<3 : true }
export function maxActivePublicLinks(plan:Plan){ return plan==='free' ? 1 : 999 }