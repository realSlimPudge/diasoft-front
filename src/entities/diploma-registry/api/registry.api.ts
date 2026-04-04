import { apiClient } from '@/shared/api/api-client'
import type { DiplomaRecord, UploadRegistryResponse, RevokeDiplomaRequest } from './dto/registry.types'

export const registryApi = {
  list: (params?: { search?: string; status?: string; page?: number }) =>
    apiClient.get<{ items: DiplomaRecord[]; total: number }>('/api/v1/university/diplomas', { params }).then((r) => r.data),

  uploadCsv: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return apiClient.post<UploadRegistryResponse>('/api/v1/university/diplomas/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)
  },

  revoke: (data: RevokeDiplomaRequest) =>
    apiClient.post(`/api/v1/university/diplomas/${data.diplomaId}/revoke`, { reason: data.reason }).then((r) => r.data),

  getQrToken: (diplomaId: string) =>
    apiClient.get<{ verificationToken: string; qrUrl: string; expiresAt: string }>(`/api/v1/university/diplomas/${diplomaId}/qr`).then((r) => r.data),
}
