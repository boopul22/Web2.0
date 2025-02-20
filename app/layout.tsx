import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import { Toaster } from "./components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Wavy Blog - Latest Articles and Insights',
  description: 'Discover the latest articles and insights on our blog. Stay updated with trending topics and expert opinions.',
  keywords: 'blog, articles, insights, trending topics',
  openGraph: {
    title: 'Wavy Blog - Latest Articles and Insights',
    description: 'Discover the latest articles and insights on our blog. Stay updated with trending topics and expert opinions.',
    url: 'http://localhost:3000',
    siteName: 'Wavy Blog',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
