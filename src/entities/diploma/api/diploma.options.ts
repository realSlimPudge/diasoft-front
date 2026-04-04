import { queryOptions, mutationOptions } from '@tanstack/react-query'
import { diplomaApi } from './diploma.api'
import { diplomaKeys } from './diploma.keys'

export const diplomaOptions = {
  byToken: (token: string) =>
    queryOptions({
      queryKey: diplomaKeys.byToken(token),
      queryFn: () => diplomaApi.verifyByToken(token),
      staleTime: 1000 * 60 * 10,
    }),

  shareLink: (token: string) =>
    queryOptions({
      queryKey: diplomaKeys.shareLink(token),
      queryFn: () => diplomaApi.resolveShareLink(token),
      staleTime: 1000 * 60 * 10,
    }),

  verifyByForm: () =>
    mutationOptions({
      mutationFn: diplomaApi.verifyByForm,
    }),
}
