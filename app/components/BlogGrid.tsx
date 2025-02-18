import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import { ImageOff } from 'lucide-react'

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  image_url: string
  created_at: string
  author: string
}

export default async function BlogGrid() {
  const supabase = createServerComponentClient({
    cookies,
  })
  
  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching blogs:', error)
    return <div className="text-center text-red-600">Error loading blogs.</div>
  }

  if (!blogs || blogs.length === 0) {
    return <p className="text-center text-gray-600">No articles available.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog: Blog) => (
        <article 
          key={blog.id} 
          className="group relative flex flex-col bg-white dark:bg-gray-900 aspect-square overflow-hidden"
        >
          <Link href={`/blog/${blog.slug}`} className="absolute inset-0">
            <div className="relative w-full h-full">
              {blog.image_url ? (
                <>
                  <Image
                    src={blog.image_url}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  <ImageOff className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                  <span className="sr-only">No image available</span>
                </div>
              )}
              
              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 text-sm text-gray-200 mb-3">
                  <span className="font-medium">
                    {blog.author || 'Anonymous'}
                  </span>
                  <span className="text-gray-400">•</span>
                  <time 
                    dateTime={blog.created_at}
                    className="text-gray-300"
                  >
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </time>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-pink-300 transition-colors">
                  {blog.title}
                </h2>
                
                <p className="text-gray-200 text-sm line-clamp-2 mb-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  {blog.excerpt}
                </p>
                
                <div className="flex items-center text-sm font-medium text-pink-300 group-hover:translate-x-1 transition-transform duration-200">
                  Read Article
                  <svg 
                    className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 7l5 5m0 0l-5 5m5-5H6" 
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
} 