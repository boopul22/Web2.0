import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  image_url: string
  created_at: string
  author: string
  category: string
  read_time: number
}

const categoryColors = {
  'Travel': 'bg-blue-100/80',
  'Lifestyle': 'bg-pink-100/80',
  'Health': 'bg-green-100/80'
} as const;

const categoryTextColors = {
  'Travel': 'text-blue-800',
  'Lifestyle': 'text-pink-800',
  'Health': 'text-green-800'
} as const;

async function getBlogs() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({
    cookies: () => cookieStore
  })
  
  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(12) // Limit to 12 most recent posts for better performance

  if (error) {
    console.error('Supabase error:', error)
    throw new Error('Failed to fetch blog posts')
  }

  return blogs as Blog[]
}

export default async function BlogGrid() {
  const blogs = await getBlogs()

  if (!blogs || blogs.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Posts Yet</h2>
          <p className="text-white/80">Check back soon for new content!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {blogs.map((blog: Blog) => (
          <article 
            key={blog.id} 
            className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-transform hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Category Tag */}
            <div className="absolute top-4 left-4 z-20">
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${categoryTextColors[blog.category as keyof typeof categoryTextColors]} ${categoryColors[blog.category as keyof typeof categoryColors]}`}>
                {blog.category}
              </span>
            </div>

            {/* Featured Image Container */}
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              {blog.image_url ? (
                <Image
                  src={blog.image_url}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={true}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No image</span>
                </div>
              )}
              
              {/* Title Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <h2 className="text-xl font-bold text-gray-900 bg-white/95 p-4 rounded-xl shadow-sm line-clamp-2">
                  {blog.title}
                </h2>
              </div>
            </div>

            <div className="p-6">
              {/* Meta Information */}
              <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                <time dateTime={blog.created_at} className="font-medium">
                  {new Date(blog.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </time>
                <span>•</span>
                <span className="font-medium">{blog.read_time} min read</span>
              </div>

              {/* Excerpt */}
              <p className="text-gray-600 mb-6 line-clamp-2">{blog.excerpt}</p>

              {/* Author and CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">{blog.author ? blog.author[0] : 'A'}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{blog.author || 'Anonymous'}</span>
                </div>
                <Link 
                  href={`/blog/${blog.slug}`}
                  className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-gray-900 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Continue Reading
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
} 