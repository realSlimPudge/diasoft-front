import { apiClient } from '@/shared/api/api-client'
import type { StudentDiploma, ShareLinkResponse } from './dto/student.types'

export const studentApi = {
  myDiploma: () =>
    apiClient.get<StudentDiploma>('/api/v1/student/diploma').then((r) => r.data),

  generateShareLink: (ttlSeconds: number) =>
    apiClient.post<ShareLinkResponse>('/api/v1/student/share-link', { ttlSeconds }).then((r) => r.data),

  revokeShareLink: (shareToken: string) =>
    apiClient.delete(`/api/v1/student/share-link/${shareToken}`).then((r) => r.data),
}
