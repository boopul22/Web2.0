'use client'

import Image from 'next/image'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  slug: string
  image_url?: string
  created_at: string
}

interface PopularArticlesProps {
  articles: Article[]
}

export function PopularArticles({ articles }: PopularArticlesProps) {
  return (
    <div className="bg-rose-50 dark:bg-gray-900/95 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-purple-950 dark:text-white">Popular Articles</h2>
      <div className="space-y-6">
        {articles.map((article) => (
          <Link 
            key={article.id}
            href={`/blog/${article.slug}`}
            className="flex items-start gap-4 group"
          >
            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
              {article.image_url ? (
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="96px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 line-clamp-2">
                {article.title}
              </h3>
              <time className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(article.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 