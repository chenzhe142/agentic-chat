import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Sidebar } from './_components/Sidebar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'mini-claude',
  description: 'minified claude stream chat web interface',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-row">
        <div className="h-full w-64 flex-none">
          <Sidebar />
        </div>
        <div className='flex-1 min-h-0'>
          {children}
        </div>
      </body>
    </html>
  )
}
