import { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import BlogGrid from './components/BlogGrid'

export const metadata: Metadata = {
  title: 'Wavy Blog',
  description: 'A curated space for thought-provoking articles and expert insights.',
  keywords: 'blog, articles, insights',
  openGraph: {
    title: 'Wavy Blog',
    description: 'A curated space for thought-provoking articles and expert insights.',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Wavy Blog'
      }
    ]
  },
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  return (
    <main className="relative min-h-screen bg-white dark:bg-gray-950">
      {/* Content wrapper with lower z-index than navigation */}
      <div className="relative z-0 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-28 pb-16 sm:pt-36 sm:pb-24">
            <Suspense 
              fallback={
                <div className="flex items-center justify-center min-h-[70vh]">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading articles...</p>
                  </div>
                </div>
              }
            >
              <BlogGrid />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}

