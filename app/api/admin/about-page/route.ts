import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function isAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')
  return token?.value === 'authenticated'
}

// GET /api/admin/about-page — returns current about page content
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const record = await prisma.siteContent.findUnique({ where: { key: 'about-page' } })
  return NextResponse.json(record ? JSON.parse(record.value) : null)
}

// PUT /api/admin/about-page — saves about page content
export async function PUT(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body = await request.json()

  await prisma.siteContent.upsert({
    where: { key: 'about-page' },
    update: { value: JSON.stringify(body) },
    create: { key: 'about-page', value: JSON.stringify(body) },
  })

  return NextResponse.json({ ok: true })
}
