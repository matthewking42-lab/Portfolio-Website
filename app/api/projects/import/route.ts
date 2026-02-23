import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Parses a single CSV line, handling quoted fields with commas inside
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"' && !inQuotes) {
      inQuotes = true
    } else if (char === '"' && inQuotes) {
      if (line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = false
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().split('\n')
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase())

  return lines.slice(1).filter((l) => l.trim()).map((line) => {
    const values = parseCSVLine(line)
    const row: Record<string, string> = {}
    headers.forEach((h, i) => {
      row[h] = values[i] ?? ''
    })
    return row
  })
}

// POST /api/projects/import — bulk import from CSV (admin only)
export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_token')
  if (!token || token.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const text = await request.text()
  const rows = parseCSV(text)

  if (rows.length === 0) {
    return NextResponse.json({ error: 'No data rows found in CSV' }, { status: 400 })
  }

  let count = 0
  const errors: string[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2 // +2 because row 1 = headers, arrays are 0-indexed
    const lat = parseFloat(row['latitude'] ?? '')
    const lng = parseFloat(row['longitude'] ?? '')

    const missing = ['title', 'sector', 'client', 'description', 'role', 'location', 'startdate'].filter(
      (f) => !row[f]
    )

    if (missing.length > 0) {
      errors.push(`Row ${rowNum}: missing required fields: ${missing.join(', ')}`)
      continue
    }

    if (isNaN(lat) || isNaN(lng)) {
      errors.push(`Row ${rowNum}: invalid latitude/longitude`)
      continue
    }

    const isOngoing = row['isongoing']?.toLowerCase() === 'true'
    // default published to true unless explicitly set to 'false'
    const published = row['published']?.toLowerCase() !== 'false'

    try {
      await prisma.project.create({
        data: {
          title: row['title'],
          reference: row['reference'] || null,
          sector: row['sector'],
          client: row['client'],
          contractValue: row['contractvalue'] || null,
          designFee: row['designfee'] || null,
          contract: row['contract'] || null,
          description: row['description'],
          role: row['role'],
          latitude: lat,
          longitude: lng,
          location: row['location'],
          startDate: row['startdate'],
          endDate: row['enddate'] || null,
          isOngoing,
          published,
        },
      })
      count++
    } catch (e) {
      errors.push(`Row ${rowNum}: ${e instanceof Error ? e.message : 'database error'}`)
    }
  }

  return NextResponse.json({ count, errors, total: rows.length })
}
