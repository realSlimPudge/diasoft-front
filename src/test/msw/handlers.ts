import { http, HttpResponse } from 'msw'

const BASE = 'https://verify.team1.213.165.211.103.sslip.io'

// ─── fixtures ────────────────────────────────────────────────────────────────

export const fixtures = {
  universityUser: {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'ITMO University',
    role: 'university' as const,
    organizationCode: 'ITMO',
  },
  studentUser: {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Иван Иванов',
    role: 'student' as const,
    organizationCode: null,
  },
  hrUser: {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'HR Demo',
    role: 'hr' as const,
    organizationCode: null,
  },
  diploma: {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    diplomaNumber: 'D-2026-0001',
    universityCode: 'ITMO',
    ownerName: 'Иван Иванов',
    ownerNameMask: 'И*** И***',
    program: 'Software Engineering',
    graduationYear: 2026,
    status: 'active' as const,
    hash: 'd46ed547',
    verificationToken: 'itmo-demo-verify-token',
    createdAt: '2026-04-04T16:38:19.133447Z',
    revokedAt: null,
    revokeReason: null,
  },
  studentDiploma: {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    diplomaNumber: 'D-2026-0001',
    universityCode: 'ITMO',
    program: 'Software Engineering',
    graduationYear: 2026,
    status: 'active' as const,
    verificationToken: 'itmo-demo-verify-token',
  },
  shareLink: {
    shareToken: 'test-share-token',
    shareUrl: 'https://verify.team1.213.165.211.103.sslip.io/s/test-share-token',
    expiresAt: '2026-04-05T10:00:00Z',
    ttlSeconds: 86400,
  },
  verificationResult: {
    verdict: 'valid' as const,
    universityCode: 'ITMO',
    diplomaNumber: 'D-2026-0001',
    ownerNameMask: 'И*** И***',
    program: 'Software Engineering',
  },
  importJob: {
    jobId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    status: 'pending' as const,
  },
  importStatus: {
    jobId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    status: 'completed' as const,
    total: 10,
    imported: 10,
    failed: 0,
    createdAt: '2026-04-04T10:00:00Z',
    updatedAt: '2026-04-04T10:05:00Z',
  },
}

// ─── handlers ────────────────────────────────────────────────────────────────

export const handlers = [
  // Auth
  http.post(`${BASE}/api/v1/auth/login`, async ({ request }) => {
    const body = await request.json() as { login: string; password: string; role: string }
    if (body.password !== 'secret') {
      return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    const userMap: Record<string, typeof fixtures.universityUser> = {
      ITMO: fixtures.universityUser,
      'D-2026-0001': fixtures.studentUser as never,
      'hr@diplomverify.ru': fixtures.hrUser as never,
    }
    const user = userMap[body.login]
    if (!user) return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    return HttpResponse.json({ accessToken: 'test-jwt-token', user })
  }),

  http.get(`${BASE}/api/v1/auth/me`, () =>
    HttpResponse.json(fixtures.universityUser),
  ),

  // Public verify
  http.post(`${BASE}/api/v1/public/verify`, async ({ request }) => {
    const body = await request.json() as { diplomaNumber: string; universityCode: string }
    if (body.diplomaNumber === 'D-2026-0001' && body.universityCode === 'ITMO') {
      return HttpResponse.json(fixtures.verificationResult)
    }
    return HttpResponse.json({ verdict: 'not_found' })
  }),

  http.get(`${BASE}/api/v1/public/verify/:token`, ({ params }) => {
    if (params.token === 'itmo-demo-verify-token') {
      return HttpResponse.json(fixtures.verificationResult)
    }
    return HttpResponse.json({ verdict: 'not_found' })
  }),

  http.get(`${BASE}/api/v1/public/share-links/:token`, ({ params }) => {
    if (params.token === 'test-share-token') {
      return HttpResponse.json(fixtures.verificationResult)
    }
    return HttpResponse.json({ error: 'Not found' }, { status: 404 })
  }),

  // University diplomas
  http.get(`${BASE}/api/v1/university/diplomas`, () =>
    HttpResponse.json({ items: [fixtures.diploma], total: 1 }),
  ),

  http.post(`${BASE}/api/v1/university/diplomas/:id/revoke`, () =>
    HttpResponse.json({}),
  ),

  http.post(`${BASE}/api/v1/university/diplomas/upload`, () =>
    HttpResponse.json(fixtures.importJob, { status: 202 }),
  ),

  http.get(`${BASE}/api/v1/university/imports/:jobId`, () =>
    HttpResponse.json(fixtures.importStatus),
  ),

  http.get(`${BASE}/api/v1/university/imports/:jobId/errors`, () =>
    HttpResponse.json({ errors: [] }),
  ),

  // Student
  http.get(`${BASE}/api/v1/student/diploma`, () =>
    HttpResponse.json(fixtures.studentDiploma),
  ),

  http.post(`${BASE}/api/v1/student/share-link`, () =>
    HttpResponse.json(fixtures.shareLink),
  ),

  http.delete(`${BASE}/api/v1/student/share-link/:token`, () =>
    HttpResponse.json({}),
  ),
]
