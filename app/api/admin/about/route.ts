import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function isAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')
  return token?.value === 'authenticated'
}

// GET /api/admin/about — returns current about content (admin only)
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const record = await prisma.siteContent.findUnique({ where: { key: 'career' } })
  return NextResponse.json(record ? JSON.parse(record.value) : null)
}

// PUT /api/admin/about — saves career content (admin only)
export async function PUT(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body = await request.json()

  await prisma.siteContent.upsert({
    where: { key: 'career' },
    update: { value: JSON.stringify(body) },
    create: { key: 'career', value: JSON.stringify(body) },
  })

  return NextResponse.json({ ok: true })
}
