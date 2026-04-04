export type DiplomaStatus = 'active' | 'revoked' | 'expired'

// Gateway BFF schema — student view is intentionally minimal
export interface StudentDiploma {
  id: string
  diplomaNumber: string
  universityCode: string
  program: string
  graduationYear: number | null
  status: DiplomaStatus
  verificationToken: string
}

export interface ShareLinkRequest {
  ttlSeconds: 3600 | 86400 | 604800 | 2592000
}

export interface ShareLinkResponse {
  shareToken: string
  shareUrl: string
  expiresAt: string
  ttlSeconds: number
}
