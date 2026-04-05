import { apiClient } from '@/shared/api/api-client'
import type {
  DiplomaListParams,
  DiplomaListResponse,
  GatewayImportAccepted,
  GatewayImportStatus,
  GatewayImportErrorsResponse,
  GatewayRevokeRequest,
  GatewayQrResponse,
} from './dto/registry.types'

export const registryApi = {
  list: (params?: DiplomaListParams) =>
    apiClient
      .get<DiplomaListResponse>('/api/v1/university/diplomas', { params })
      .then((r) => r.data),

  revoke: (diplomaId: string, data: GatewayRevokeRequest) =>
    apiClient
      .post(`/api/v1/university/diplomas/${diplomaId}/revoke`, data)
      .then((r) => r.data),

  getQr: (diplomaId: string) =>
    apiClient
      .get<GatewayQrResponse>(`/api/v1/university/diplomas/${diplomaId}/qr`)
      .then((r) => r.data),

  uploadCsv: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return apiClient
      .post<GatewayImportAccepted>('/api/v1/university/diplomas/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },

  getImportStatus: (jobId: string) =>
    apiClient
      .get<GatewayImportStatus>(`/api/v1/university/imports/${jobId}`)
      .then((r) => r.data),

  getImportErrors: (jobId: string) =>
    apiClient
      .get<GatewayImportErrorsResponse>(`/api/v1/university/imports/${jobId}/errors`)
      .then((r) => r.data),
}
