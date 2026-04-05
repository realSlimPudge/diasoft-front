import type { DiplomaListParams } from './dto/registry.types'

export const registryKeys = {
  all: ['registry'] as const,
  lists: () => ['registry', 'list'] as const,
  list: (filters: Omit<DiplomaListParams, 'cursor' | 'limit'>) =>
    ['registry', 'list', filters] as const,
  diploma: (id: string) => ['registry', 'diploma', id] as const,
}
