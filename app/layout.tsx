import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

// const inter = Inter({ subsets: ['latin'] })
const gabriella = localFont({
  src: './lib/fonts/gabriella.woff2',
  display: 'swap',
  variable: '--font-gabriella'
})
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


export const metadata: Metadata = {
  title: 'Brands - An Accountability Database',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${owners.variable} ${gabriella.variable} font-sans min-h-screen`}>{children}</body>
    </html>
  )
}
