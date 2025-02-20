import { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import BlogGrid from './components/BlogGrid'
import ErrorBoundary from './components/ErrorBoundary'

export const metadata: Metadata = {
  title: 'Groovy - Creative Blog Platform',
  description: 'Explore thought-provoking articles on travel, lifestyle, and health.',
  keywords: 'blog, travel, lifestyle, health, articles',
  openGraph: {
    title: 'Groovy - Creative Blog Platform',
    description: 'Explore thought-provoking articles on travel, lifestyle, and health.',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Groovy Blog'
      }
    ]
  },
}

export const revalidate = 3600 // Revalidate every hour

export default async function HomePage() {
  return (
    <main className="relative min-h-screen">
      {/* Content wrapper */}
      <div className="relative z-0 w-full">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="pt-28 pb-16">
            <ErrorBoundary fallback={<div className="text-white">Something went wrong loading the blog posts. Please try again later.</div>}>
              <Suspense 
                fallback={
                  <div className="flex items-center justify-center min-h-[70vh]">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                      <p className="text-sm text-white/80">Loading articles...</p>
                    </div>
                  </div>
                }
              >
                <BlogGrid />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </main>
  )
}

