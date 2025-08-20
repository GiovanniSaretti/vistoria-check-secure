import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export function useTemplates() {
  const { organization } = useAuth()
  const queryClient = useQueryClient()

  const templatesQuery = useQuery({
    queryKey: ['templates', organization?.id],
    queryFn: async () => {
      if (!organization?.id) return []

      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('organization_id', organization.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!organization?.id
  })

  const createTemplateMutation = useMutation({
    mutationFn: async (template: {
      name: string
      description?: string
      schema_json: any
    }) => {
      if (!organization?.id) throw new Error('No organization')

      const { data, error } = await supabase
        .from('templates')
        .insert({
          ...template,
          organization_id: organization.id,
          version: 1,
          is_active: true
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
    }
  })

  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<any>) => {
      const { data, error } = await supabase
        .from('templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
    }
  })

  return {
    templates: templatesQuery.data || [],
    loading: templatesQuery.isLoading,
    error: templatesQuery.error,
    createTemplate: createTemplateMutation.mutate,
    updateTemplate: updateTemplateMutation.mutate,
    isCreating: createTemplateMutation.isPending,
    isUpdating: updateTemplateMutation.isPending
  }
}

export function useTemplate(id: string) {
  const templateQuery = useQuery({
    queryKey: ['template', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id
  })

  return {
    template: templateQuery.data,
    loading: templateQuery.isLoading,
    error: templateQuery.error
  }
}