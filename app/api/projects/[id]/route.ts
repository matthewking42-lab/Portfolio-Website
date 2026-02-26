import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function isAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')
  return token?.value === 'authenticated'
}

// GET /api/projects/:id
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const project = await prisma.project.findUnique({ where: { id: params.id } })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(project)
}

// PUT /api/projects/:id — full update
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body = await request.json()

  const project = await prisma.project.update({
    where: { id: params.id },
    data: {
      title: body.title,
      reference: body.reference || null,
      sector: body.sector,
      client: body.client,
      contract: body.contract || null,
      description: body.description,
      role: body.role,
      latitude: parseFloat(body.latitude),
      longitude: parseFloat(body.longitude),
      location: body.location,
      startDate: body.startDate,
      endDate: body.endDate || null,
      isOngoing: Boolean(body.isOngoing),
      pdfReport: body.pdfReport ?? undefined,
      published: Boolean(body.published),
      skills: Array.isArray(body.skills) ? body.skills : [],
    },
  })

  return NextResponse.json(project)
}

// PATCH /api/projects/:id — partial update (e.g. toggle published)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body = await request.json()
  const project = await prisma.project.update({
    where: { id: params.id },
    data: body,
  })

  return NextResponse.json(project)
}

// DELETE /api/projects/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  await prisma.project.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
