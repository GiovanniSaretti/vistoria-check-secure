import { supabase } from '@/integrations/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

export interface AuthUser extends User {
  profile?: {
    id: string
    name: string | null
    email: string | null
    role: 'admin' | 'inspector'
    organization_id: string
    organization?: {
      id: string
      name: string
      plan: 'payg' | 'unlimited'
    }
  }
}

export interface AuthSession extends Session {
  user: AuthUser
}

/**
 * Sign up new user and create organization
 */
export async function signUp(email: string, password: string, organizationName: string) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError
  if (!authData.user) throw new Error('Failed to create user')

  // Create organization
  const { data: orgData, error: orgError } = await supabase
    .from('organizations')
    .insert({
      name: organizationName,
      owner_id: authData.user.id,
      plan: 'payg'
    })
    .select()
    .single()

  if (orgError) throw orgError

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      user_id: authData.user.id,
      organization_id: orgData.id,
      role: 'admin',
      name: email.split('@')[0],
      email: email
    })

  if (profileError) throw profileError

  // Create basic inspection template
  const { error: templateError } = await supabase
    .from('templates')
    .insert({
      organization_id: orgData.id,
      name: 'Inspeção Básica',
      description: 'Template básico para inspeções',
      schema_json: {
        sections: [
          {
            title: 'Informações Gerais',
            fields: [
              {
                id: 'location',
                type: 'text',
                label: 'Local da Inspeção',
                required: true
              },
              {
                id: 'inspector_name',
                type: 'text', 
                label: 'Nome do Inspetor',
                required: true
              }
            ]
          }
        ]
      },
      created_by: authData.user.id
    })

  if (templateError) throw templateError

  return { user: authData.user, organization: orgData }
}

/**
 * Sign in user
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

/**
 * Sign out user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Get current user with profile and organization
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      *,
      organization:organizations(*)
    `)
    .eq('user_id', user.id)
    .single()

  if (!profile) return user as AuthUser

  return {
    ...user,
    profile: {
      ...profile,
      organization: profile.organization
    }
  } as AuthUser
}

/**
 * Get current session with enhanced user data
 */
export async function getCurrentSession(): Promise<AuthSession | null> {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) return null

  const user = await getCurrentUser()
  if (!user) return null

  return {
    ...session,
    user
  } as AuthSession
}