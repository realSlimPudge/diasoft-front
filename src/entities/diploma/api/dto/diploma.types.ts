export type Verdict = 'valid' | 'revoked' | 'expired' | 'not_found'

export interface VerificationRequest {
  diplomaNumber: string
  universityCode: string
}

export interface VerificationResult {
  verdict: Verdict
  universityCode?: string
  diplomaNumber?: string
  ownerNameMask?: string
  program?: string
}
