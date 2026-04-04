import { apiClient } from '@/shared/api/api-client'
import type { VerificationRequest, VerificationResult } from './dto/diploma.types'

export const diplomaApi = {
  verifyByForm: (data: VerificationRequest) =>
    apiClient.post<VerificationResult>('/api/v1/public/verify', data).then((r) => r.data),

  verifyByToken: (token: string) =>
    apiClient.get<VerificationResult>(`/api/v1/public/verify/${token}`).then((r) => r.data),

  resolveShareLink: (token: string) =>
    apiClient.get<VerificationResult>(`/api/v1/public/share-links/${token}`).then((r) => r.data),
}
