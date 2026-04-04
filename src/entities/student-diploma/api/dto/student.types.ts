export interface StudentDiploma {
  id: string
  diplomaNumber: string
  universityCode: string
  program: string
  graduationYear: number
  status: 'active' | 'revoked' | 'expired'
  verificationToken: string
}

export interface ShareLinkResponse {
  shareToken: string
  shareUrl: string
  expiresAt: string
  ttlSeconds: number
}
