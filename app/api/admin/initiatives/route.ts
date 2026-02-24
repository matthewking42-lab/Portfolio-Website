import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function isAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')
  return token?.value === 'authenticated'
}

// GET /api/admin/initiatives — returns current initiatives content
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const record = await prisma.siteContent.findUnique({ where: { key: 'initiatives' } })
  return NextResponse.json(record ? JSON.parse(record.value) : null)
}

// PUT /api/admin/initiatives — saves initiatives content
export async function PUT(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body = await request.json()

  await prisma.siteContent.upsert({
    where: { key: 'initiatives' },
    update: { value: JSON.stringify(body) },
    create: { key: 'initiatives', value: JSON.stringify(body) },
  })

  return NextResponse.json({ ok: true })
}
