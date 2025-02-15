import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Image from 'next/image'
import { Metadata } from 'next'

interface PageParams {
  slug: string
}

interface Props {
  params: PageParams
  searchParams?: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerComponentClient({
    cookies,
  })
  
  const { data: blog } = await supabase
    .from('blogs')
    .select('title,excerpt')
    .eq('slug', params.slug)
    .maybeSingle()

  return {
    title: blog?.title || 'Blog Post',
    description: blog?.excerpt || 'Read our latest blog post',
  }
}

export default async function BlogPost({ params }: Props) {
  const supabase = createServerComponentClient({
    cookies,
  })
  
  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle()

  if (error) {
    console.error('Error fetching blog:', error)
    return <div className="text-center text-red-600 mt-10">Error loading blog post.</div>
  }

  if (!blog) {
    return <div className="text-center text-gray-600 mt-10">Blog post not found.</div>
  }

  return (
    <div className="max-w-3xl mx-auto my-10 bg-white p-8 rounded-lg shadow">
      <div className="relative w-full aspect-[16/9] mb-6">
        {blog.image_url ? (
          <Image 
            src={blog.image_url}
            alt={blog.title || 'Blog post image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-lg"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
        {blog.content}
      </div>
    </div>
  )
} 