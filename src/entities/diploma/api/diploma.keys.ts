export const diplomaKeys = {
  all: ['diploma'] as const,
  byToken: (token: string) => ['diploma', 'token', token] as const,
  shareLink: (token: string) => ['diploma', 'share', token] as const,
}
