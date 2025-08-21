import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

export function useInspections() {
  const { organization } = useAuth()
  const queryClient = useQueryClient()

  const inspectionsQuery = useQuery({
    queryKey: ['inspections', organization?.id],
    queryFn: async () => {
      if (!organization?.id) return []

      const { data, error } = await supabase
        .from('inspections')
        .select(`
          *,
          template:templates(name),
          created_by_profile:profiles!inspections_created_by_fkey(name),
          inspection_items(*),
          photos(*),
          signatures(*),
          pdfs(*)
        `)
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!organization?.id
  })

  const createInspectionMutation = useMutation({
    mutationFn: async (inspection: {
      template_id: string
      title: string
      context_json: any
    }) => {
      if (!organization?.id) throw new Error('No organization')

      // Generate inspection number
      const { count } = await supabase
        .from('inspections')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organization.id)

      const number = `VST-${String((count || 0) + 1).padStart(3, '0')}`

      const { data, error } = await supabase
        .from('inspections')
        .insert({
          ...inspection,
          organization_id: organization.id,
          number,
          status: 'draft'
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspections'] })
    }
  })

  const updateInspectionMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<any>) => {
      const { data, error } = await supabase
        .from('inspections')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspections'] })
    }
  })

  return {
    inspections: inspectionsQuery.data || [],
    loading: inspectionsQuery.isLoading,
    error: inspectionsQuery.error,
    createInspection: createInspectionMutation.mutate,
    updateInspection: updateInspectionMutation.mutate,
    isCreating: createInspectionMutation.isPending,
    isUpdating: updateInspectionMutation.isPending
  }
}

export function useInspection(id: string) {
  const inspectionQuery = useQuery({
    queryKey: ['inspection', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inspections')
        .select(`
          *,
          template:templates(*),
          created_by_profile:profiles!inspections_created_by_fkey(name),
          inspection_items(*),
          photos(*),
          signatures(*),
          pdfs(*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id
  })

  return {
    inspection: inspectionQuery.data,
    loading: inspectionQuery.isLoading,
    error: inspectionQuery.error
  }
}