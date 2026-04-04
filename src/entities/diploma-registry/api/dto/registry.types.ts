export type DiplomaStatus = 'active' | 'revoked' | 'expired'

export interface DiplomaRecord {
  id: string
  diplomaNumber: string
  universityCode: string
  ownerName: string
  ownerNameMask: string
  program: string
  graduationYear: number
  status: DiplomaStatus
  hash: string
  verificationToken: string
  createdAt: string
  revokedAt?: string
  revokeReason?: string
}

export interface UploadRegistryResponse {
  total: number
  imported: number
  failed: number
  errors: { row: number; message: string }[]
}

export interface RevokeDiplomaRequest {
  diplomaId: string
  reason: string
}
