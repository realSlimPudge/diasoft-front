export type DiplomaStatus = 'active' | 'revoked' | 'expired'
export type ImportJobStatus = 'pending' | 'processing' | 'completed' | 'partially_failed' | 'failed'

// Gateway BFF schema for university diploma list
export interface Diploma {
  id: string
  diplomaNumber: string
  universityCode: string
  ownerName: string
  ownerNameMask: string
  program: string
  graduationYear: number | null
  status: DiplomaStatus
  hash: string | null
  verificationToken: string | null
  createdAt: string
  revokedAt: string | null
  revokeReason: string | null
}

export interface DiplomaListResponse {
  items: Diploma[]
  total: number
}

// Gateway BFF import schemas
export interface GatewayImportAccepted {
  jobId: string
  status: ImportJobStatus
}

export interface GatewayImportStatus {
  jobId: string
  status: ImportJobStatus
  total: number | null
  imported: number
  failed: number
  createdAt: string
  updatedAt: string
}

export interface GatewayImportError {
  row: number
  message: string
}

export interface GatewayImportErrorsResponse {
  errors: GatewayImportError[]
}

export interface GatewayRevokeRequest {
  reason: string
}

export interface GatewayQrResponse {
  verificationToken: string
  qrUrl: string
  expiresAt: string
}
