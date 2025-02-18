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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog: Blog) => (
        <article key={blog.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
          <Link href={`/blog/${blog.slug}`} className="block h-full">
            <div className="relative aspect-[16/9] bg-gray-100 dark:bg-gray-800">
              {blog.image_url ? (
                <>
                  <Image
                    src={blog.image_url}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gray-900/10 hover:bg-gray-900/20 transition-colors" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageOff className="w-8 h-8 text-gray-400" />
                  <span className="sr-only">No image available</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-pink-600 transition-colors">
                {blog.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {blog.excerpt}
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium text-gray-900">
                    {blog.author || 'Anonymous'}
                  </span>
                  <span>•</span>
                  <time dateTime={blog.created_at}>
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </time>
                </div>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
} 