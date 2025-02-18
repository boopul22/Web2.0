import { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import BlogGrid from './components/BlogGrid'

export const metadata: Metadata = {
  title: 'Wavy Blog - Latest Articles and Insights',
  description: 'Discover the latest articles and insights on our blog. Stay updated with trending topics and expert opinions.',
  keywords: 'blog, articles, insights, trending topics',
  openGraph: {
    title: 'Wavy Blog - Latest Articles and Insights',
    description: 'Discover the latest articles and insights on our blog. Stay updated with trending topics and expert opinions.',
    type: 'website',
  },
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Minimal Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest Articles</h1>
          <p className="text-lg text-gray-600">Discover our curated collection of insights and stories</p>
        </div>

        {/* Blog Grid with Loading State */}
        <Suspense fallback={
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          </div>
        }>
          <BlogGrid />
        </Suspense>
      </div>
    </main>
  )
}

