export const registryKeys = {
  all: ['registry'] as const,
  list: (params?: object) => ['registry', 'list', params] as const,
  diploma: (id: string) => ['registry', 'diploma', id] as const,
}
