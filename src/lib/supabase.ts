import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Database types
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          plan: 'payg' | 'unlimited'
          billing_status: string
          owner_id: string
          settings: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          plan?: 'payg' | 'unlimited'
          billing_status?: string
          owner_id: string
          settings?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          plan?: 'payg' | 'unlimited'
          billing_status?: string
          owner_id?: string
          settings?: any
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          role: 'admin' | 'inspector'
          name: string | null
          email: string | null
          avatar_url: string | null
          settings: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          role?: 'admin' | 'inspector'
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          settings?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string
          role?: 'admin' | 'inspector'
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          settings?: any
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          organization_id: string
          name: string
          description: string | null
          schema_json: any
          version: number
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          description?: string | null
          schema_json?: any
          version?: number
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          description?: string | null
          schema_json?: any
          version?: number
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inspections: {
        Row: {
          id: string
          organization_id: string
          template_id: string
          number: string
          title: string | null
          status: 'draft' | 'awaiting_sign' | 'signed' | 'archived'
          context_json: any
          data_json: any
          created_by: string | null
          signed_at: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          template_id: string
          number: string
          title?: string | null
          status?: 'draft' | 'awaiting_sign' | 'signed' | 'archived'
          context_json?: any
          data_json?: any
          created_by?: string | null
          signed_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          template_id?: string
          number?: string
          title?: string | null
          status?: 'draft' | 'awaiting_sign' | 'signed' | 'archived'
          context_json?: any
          data_json?: any
          created_by?: string | null
          signed_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inspection_items: {
        Row: {
          id: string
          inspection_id: string
          path: string
          label: string
          type: 'status' | 'text' | 'number' | 'boolean'
          value: string | null
          notes: string | null
          require_photo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          inspection_id: string
          path: string
          label: string
          type: 'status' | 'text' | 'number' | 'boolean'
          value?: string | null
          notes?: string | null
          require_photo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          inspection_id?: string
          path?: string
          label?: string
          type?: 'status' | 'text' | 'number' | 'boolean'
          value?: string | null
          notes?: string | null
          require_photo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      photos: {
        Row: {
          id: string
          inspection_id: string
          item_path: string | null
          file_url: string
          thumb_url: string | null
          filename: string | null
          file_size: number | null
          mime_type: string | null
          exif_json: any
          created_at: string
        }
        Insert: {
          id?: string
          inspection_id: string
          item_path?: string | null
          file_url: string
          thumb_url?: string | null
          filename?: string | null
          file_size?: number | null
          mime_type?: string | null
          exif_json?: any
          created_at?: string
        }
        Update: {
          id?: string
          inspection_id?: string
          item_path?: string | null
          file_url?: string
          thumb_url?: string | null
          filename?: string | null
          file_size?: number | null
          mime_type?: string | null
          exif_json?: any
          created_at?: string
        }
      }
      signatures: {
        Row: {
          id: string
          inspection_id: string
          role: 'inspector' | 'client'
          signed_by_name: string
          signed_by_email: string | null
          signed_at: string
          ip_address: string | null
          user_agent: string | null
          geo_json: any
          file_url: string
          created_at: string
        }
        Insert: {
          id?: string
          inspection_id: string
          role: 'inspector' | 'client'
          signed_by_name: string
          signed_by_email?: string | null
          signed_at?: string
          ip_address?: string | null
          user_agent?: string | null
          geo_json?: any
          file_url: string
          created_at?: string
        }
        Update: {
          id?: string
          inspection_id?: string
          role?: 'inspector' | 'client'
          signed_by_name?: string
          signed_by_email?: string | null
          signed_at?: string
          ip_address?: string | null
          user_agent?: string | null
          geo_json?: any
          file_url?: string
          created_at?: string
        }
      }
      pdfs: {
        Row: {
          id: string
          inspection_id: string
          file_url: string
          filename: string | null
          file_size: number | null
          sha256: string
          canonical_json: string
          generated_at: string
          processing: boolean
          created_at: string
        }
        Insert: {
          id?: string
          inspection_id: string
          file_url: string
          filename?: string | null
          file_size?: number | null
          sha256: string
          canonical_json: string
          generated_at?: string
          processing?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          inspection_id?: string
          file_url?: string
          filename?: string | null
          file_size?: number | null
          sha256?: string
          canonical_json?: string
          generated_at?: string
          processing?: boolean
          created_at?: string
        }
      }
      public_links: {
        Row: {
          id: string
          inspection_id: string
          token: string
          type: 'verification' | 'signature'
          expires_at: string
          views_count: number
          max_views: number | null
          is_revoked: boolean
          metadata: any
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          inspection_id: string
          token: string
          type?: 'verification' | 'signature'
          expires_at: string
          views_count?: number
          max_views?: number | null
          is_revoked?: boolean
          metadata?: any
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          inspection_id?: string
          token?: string
          type?: 'verification' | 'signature'
          expires_at?: string
          views_count?: number
          max_views?: number | null
          is_revoked?: boolean
          metadata?: any
          created_by?: string | null
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          organization_id: string
          actor_id: string | null
          action: string
          entity: string
          entity_id: string | null
          metadata: any
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          actor_id?: string | null
          action: string
          entity: string
          entity_id?: string | null
          metadata?: any
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          actor_id?: string | null
          action?: string
          entity?: string
          entity_id?: string | null
          metadata?: any
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
  }
}