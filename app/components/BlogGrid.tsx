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
  'Travel': 'bg-[#F3D1F4] text-[#2A1F2B]',
  'Lifestyle': 'bg-[#40B7AC] text-white',
  'Health': 'bg-[#BEFA9F] text-[#1A3D14]'
} as const;

const categoryTextColors = {
  'Travel': 'text-[#8B4B8E] hover:text-[#6A3A6B]',
  'Lifestyle': 'text-[#40B7AC] hover:text-[#2A7A72]',
  'Health': 'text-[#2E7B21] hover:text-[#1F5316]'
} as const;

async function getBlogs(): Promise<Blog[]> {
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
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-30">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-8 relative z-10">
        {blogs.map((blog: Blog, index: number) => {
          const { id, title, slug, excerpt, image_url, created_at, author, category, read_time } = blog;
          
          // Determine card size based on index
          const isLarge = index === 0;
          const isMedium = index === 1 || index === 2;
          const cardClass = isLarge 
            ? 'md:col-span-6 lg:col-span-4' 
            : isMedium 
              ? 'md:col-span-3 lg:col-span-2' 
              : 'md:col-span-2';

          return (
            <article 
              key={id} 
              className={`group relative rounded-3xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-xl ${categoryColors[category as keyof typeof categoryColors] || 'bg-white'} ${cardClass}`}
            >
              {/* Category Tag */}
              <div className="absolute top-4 left-4 z-20">
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-white shadow-md ${categoryTextColors[category as keyof typeof categoryTextColors]}`}>
                  {category}
                </span>
              </div>

              {/* Featured Image Container */}
              <div className={`relative w-full overflow-hidden ${isLarge ? 'aspect-[16/9]' : isMedium ? 'aspect-[3/2]' : 'aspect-[4/3]'}`}>
                {image_url ? (
                  <>
                    <Image
                      src={image_url}
                      alt={title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes={isLarge 
                        ? "(max-width: 768px) 100vw, 66vw"
                        : isMedium
                          ? "(max-width: 768px) 100vw, 33vw"
                          : "(max-width: 768px) 100vw, 25vw"
                      }
                      priority={isLarge}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <span className="text-white/90 text-sm">No image</span>
                  </div>
                )}
                
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <h2 className={`font-bold text-white drop-shadow-lg line-clamp-2 ${isLarge ? 'text-3xl' : isMedium ? 'text-2xl' : 'text-xl'}`}>
                    {title}
                  </h2>
                </div>
              </div>

              <div className={`${isLarge ? 'p-8' : 'p-6'} ${categoryColors[category as keyof typeof categoryColors]}`}>
                {/* Meta Information */}
                <div className="flex items-center gap-3 text-sm opacity-90 mb-4">
                  <time dateTime={created_at} className="font-medium">
                    {new Date(created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </time>
                  <span>•</span>
                  <span className="font-medium">{read_time} min read</span>
                </div>

                {/* Excerpt */}
                <p className={`opacity-90 mb-6 font-medium ${isLarge ? 'line-clamp-3' : 'line-clamp-2'}`}>{excerpt}</p>

                {/* Author and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-current/10">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full bg-black/10 flex items-center justify-center ${isLarge ? 'w-12 h-12' : 'w-10 h-10'}`}>
                      <span className={`text-current font-medium ${isLarge ? 'text-base' : 'text-sm'}`}>{author ? author[0] : 'A'}</span>
                    </div>
                    <span className={`font-semibold ${isLarge ? 'text-base' : 'text-sm'}`}>{author || 'Anonymous'}</span>
                  </div>
                  <Link 
                    href={`/blog/${slug}`}
                    className={`inline-flex items-center px-5 py-2.5 font-semibold bg-black/10 rounded-full hover:bg-black/20 transition-colors ${isLarge ? 'text-base' : 'text-sm'}`}
                  >
                    Continue Reading
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  )
} 