import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

// Import local fonts for
// title
const gabriella = localFont({
  src: './lib/fonts/gabriella.woff2',
  display: 'swap',
  variable: '--font-gabriella'
})
// text
const owners = localFont({
  src: [
    {
      path: './lib/fonts/owners-400.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: './lib/fonts/owners-italic-400.woff2',
      weight: '400',
      style: 'italic'
    },
    {
      path: './lib/fonts/owners-500.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: './lib/fonts/owners-italic-500.woff2',
      weight: '500',
      style: 'italic'
    }
  ],
  display: 'swap',
  variable: '--font-owners'
})

// SEO site metadata
export const metadata: Metadata = {
  title: 'Accountable Brands',
  description: 'Open-source platform for tracking the misleading claims and shady practices of household brands.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${owners.variable} font-sans min-h-screen`}>{children}</body>
    </html>
  )
}
