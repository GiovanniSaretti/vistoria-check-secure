export type Plan = 'free' | 'payg' | 'starter' | 'pro' | 'business'

export interface PlanLimits {
  maxPdfsPerMonth: number | null // null = unlimited
  maxActivePublicLinks: number
  maxUsers: number
  retentionDays: number
  features: string[]
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    maxPdfsPerMonth: 3,
    maxActivePublicLinks: 1,
    maxUsers: 1,
    retentionDays: 30,
    features: ['basic_templates', 'photos', 'signatures']
  },
  payg: {
    maxPdfsPerMonth: null,
    maxActivePublicLinks: 5,
    maxUsers: 1,
    retentionDays: 90,
    features: ['basic_templates', 'photos', 'signatures', 'custom_templates']
  },
  starter: {
    maxPdfsPerMonth: null,
    maxActivePublicLinks: 10,
    maxUsers: 2,
    retentionDays: 365,
    features: ['basic_templates', 'photos', 'signatures', 'custom_templates', 'branding']
  },
  pro: {
    maxPdfsPerMonth: null,
    maxActivePublicLinks: 50,
    maxUsers: 5,
    retentionDays: 730,
    features: ['basic_templates', 'photos', 'signatures', 'custom_templates', 'branding', 'reinspection', 'api_access']
  },
  business: {
    maxPdfsPerMonth: null,
    maxActivePublicLinks: 200,
    maxUsers: 20,
    retentionDays: -1, // unlimited
    features: ['basic_templates', 'photos', 'signatures', 'custom_templates', 'branding', 'reinspection', 'api_access', 'white_label', 'sso']
  }
}

export function canGeneratePdf(plan: Plan, currentPdfCount: number): boolean {
  const limits = PLAN_LIMITS[plan]
  if (limits.maxPdfsPerMonth === null) return true
  return currentPdfCount < limits.maxPdfsPerMonth
}

export function maxActivePublicLinks(plan: Plan): number {
  return PLAN_LIMITS[plan].maxActivePublicLinks
}

export function canCreateReinspection(plan: Plan): boolean {
  return PLAN_LIMITS[plan].features.includes('reinspection')
}

export function getPlanPrice(plan: Plan, isAnnual: boolean = false): number {
  const monthlyPrices = {
    free: 0,
    payg: 19, // per inspection
    starter: 59,
    pro: 149,
    business: 349
  }
  
  const price = monthlyPrices[plan]
  return isAnnual ? Math.round(price * 0.8) : price // 20% discount for annual
}