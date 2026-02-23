import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_token')
  if (!token || token.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const timestamp = Date.now()
  // Sanitise filename
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filename = `${timestamp}-${safeName}`

  const uploadsDir = join(process.cwd(), 'public', 'uploads')

  // Ensure directory exists
  await mkdir(uploadsDir, { recursive: true })
  await writeFile(join(uploadsDir, filename), buffer)

  return NextResponse.json({ filename })
}
