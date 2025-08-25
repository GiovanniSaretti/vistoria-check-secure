import { createClient } from '@supabase/supabase-js'

const url = 'https://qyjoxzxtadduaqwtsbid.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5am94enh0YWRkdWFxd3RzYmlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3Mjk4NjQsImV4cCI6MjA3MTMwNTg2NH0.xKwrJ1-syubIndaJzD56b4mjGGqb42K9DpwaeEY9NSw'

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
})