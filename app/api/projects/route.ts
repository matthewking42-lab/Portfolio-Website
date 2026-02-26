import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/projects — public list of published projects (?pinned=true for hero map)
export async function GET(request: NextRequest) {
  const pinned = new URL(request.url).searchParams.get('pinned') === 'true'
  const where = pinned ? { published: true, pinned: true } : { published: true }
  const projects = await prisma.project.findMany({
    where,
    select: {
      id: true,
      title: true,
      sector: true,
      location: true,
      latitude: true,
      longitude: true,
      client: true,
      role: true,
      startDate: true,
      endDate: true,
      isOngoing: true,
      skills: true,
    },
    orderBy: { startDate: 'desc' },
  })
  return NextResponse.json(projects)
}

// POST /api/projects — create project (admin only, checked via cookie middleware)
export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_token')
  if (!token || token.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body = await request.json()

  const project = await prisma.project.create({
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
      pdfReport: body.pdfReport || null,
      published: Boolean(body.published),
      skills: Array.isArray(body.skills) ? body.skills : [],
    },
  })

  return NextResponse.json(project, { status: 201 })
}
