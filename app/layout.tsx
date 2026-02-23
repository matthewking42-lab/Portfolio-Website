import type { Metadata } from 'next'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Matthew King — Civil & Structural Design Engineer',
  description:
    'Portfolio of Matthew King, Civil & Structural Design Engineer at AmcoGiffen. Rail bridges, structural design, and infrastructure projects across the UK.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  )
}
