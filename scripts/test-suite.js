// Automated verification script for Harbor Support System

const BASE_URL = 'http://localhost:3000'

async function runTests() {
  console.log('--- Starting System Verification Tests ---\n')
  let passed = 0
  let failed = 0

  async function test(name, fn) {
    try {
      await fn()
      console.log(`✅ [PASS] ${name}`)
      passed++
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message || err)
      failed++
    }
  }

  // 1. Landing Page
  await test('Public Landing Page (/) returns 200 and has no AI jargon', async () => {
    const res = await fetch(`${BASE_URL}/`)
    if (!res.ok) throw new Error(`Status ${res.status}`)
    const html = await res.text()
    if (html.includes('AI Triage Engine') || html.includes('Gemini 3.6 Flash')) {
      throw new Error('Found exposed AI technical jargon on public landing page')
    }
    if (!html.includes('Harbor') && !html.includes('Support')) {
      throw new Error('Expected Harbor branding')
    }
  })

  // 2. Customer Login page
  await test('Customer Login Page (/login) returns 200', async () => {
    const res = await fetch(`${BASE_URL}/login`)
    if (!res.ok) throw new Error(`Status ${res.status}`)
  })

  // 3. Unauthenticated /dashboard redirects to /login
  await test('Unauthenticated /dashboard redirects to /login', async () => {
    const res = await fetch(`${BASE_URL}/dashboard`, { redirect: 'manual' })
    if (res.status !== 307 && res.status !== 302) {
      throw new Error(`Expected redirect (302/307), got ${res.status}`)
    }
    const loc = res.headers.get('location') || ''
    if (!loc.includes('/login')) {
      throw new Error(`Expected redirect to /login, got ${loc}`)
    }
  })

  // 4. Unauthenticated /submit redirects to /login
  await test('Unauthenticated /submit redirects to /login', async () => {
    const res = await fetch(`${BASE_URL}/submit`, { redirect: 'manual' })
    if (res.status !== 307 && res.status !== 302) {
      throw new Error(`Expected redirect (302/307), got ${res.status}`)
    }
    const loc = res.headers.get('location') || ''
    if (!loc.includes('/login')) {
      throw new Error(`Expected redirect to /login, got ${loc}`)
    }
  })

  // 5. Unauthenticated /admin/dashboard redirects to /admin/login
  await test('Unauthenticated /admin/dashboard redirects to /admin/login', async () => {
    const res = await fetch(`${BASE_URL}/admin/dashboard`, { redirect: 'manual' })
    if (res.status !== 307 && res.status !== 302) {
      throw new Error(`Expected redirect (302/307), got ${res.status}`)
    }
    const loc = res.headers.get('location') || ''
    if (!loc.includes('/admin/login')) {
      throw new Error(`Expected redirect to /admin/login, got ${loc}`)
    }
  })

  // 6. Admin Login Page returns 200
  await test('Admin Login Page (/admin/login) returns 200', async () => {
    const res = await fetch(`${BASE_URL}/admin/login`)
    if (!res.ok) throw new Error(`Status ${res.status}`)
  })

  // 7. Customer Auth Flow & Privacy Isolation
  let aliceCookie = ''
  await test('Customer sign-in creates session cookie', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alice@example.com', name: 'Alice Test' }),
    })
    if (!res.ok) throw new Error(`Status ${res.status}`)
    const setCookie = res.headers.get('set-cookie') || ''
    if (!setCookie.includes('harbor_customer=')) {
      throw new Error('harbor_customer cookie was not set')
    }
    aliceCookie = setCookie.split(';')[0]
  })

  // 8. Session endpoint validation
  await test('Session endpoint returns authenticated customer', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/session`, {
      headers: { Cookie: aliceCookie },
    })
    if (!res.ok) throw new Error(`Status ${res.status}`)
    const data = await res.json()
    if (data.customer?.email !== 'alice@example.com') {
      throw new Error(`Expected alice@example.com, got ${data.customer?.email}`)
    }
    if (data.admin !== null) {
      throw new Error('Customer session should not have admin rights')
    }
  })

  // 9. Customer Requests isolation
  await test('Customer /api/requests returns array and strictly filters by user email', async () => {
    const res = await fetch(`${BASE_URL}/api/requests`, {
      headers: { Cookie: aliceCookie },
    })
    if (!res.ok) throw new Error(`Status ${res.status}`)
    const data = await res.json()
    if (!Array.isArray(data.requests)) {
      throw new Error('Expected requests to be an array')
    }
    // Verify any requests returned belong to alice
    for (const req of data.requests) {
      if (req.email.toLowerCase() !== 'alice@example.com') {
        throw new Error(`Found unauthorized ticket belonging to ${req.email}`)
      }
    }
  })

  // 10. Admin API without admin cookie is blocked
  await test('/api/admin/requests blocks unauthenticated and customer requests', async () => {
    const res1 = await fetch(`${BASE_URL}/api/admin/requests`)
    if (res1.status !== 401) throw new Error(`Expected 401, got ${res1.status}`)

    const res2 = await fetch(`${BASE_URL}/api/admin/requests`, {
      headers: { Cookie: aliceCookie },
    })
    if (res2.status !== 401) throw new Error(`Customer should receive 401 on admin endpoint, got ${res2.status}`)
  })

  console.log(`\n--- Verification Complete: ${passed} Passed, ${failed} Failed ---`)
  if (failed > 0) process.exit(1)
}

runTests().catch(err => {
  console.error('Fatal test error:', err)
  process.exit(1)
})
