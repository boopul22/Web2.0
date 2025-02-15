import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies })
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
      {blog.image_url && (
        <img 
          src={blog.image_url} 
          alt={blog.title} 
          className="w-full h-64 object-cover rounded-lg mb-6" 
        />
      )}
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {blog.content}
      </div>
    </div>
  )
} 