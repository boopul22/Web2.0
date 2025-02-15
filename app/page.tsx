import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching blogs:', error)
    return <div className="text-center text-red-600 mt-10">Error loading blogs.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">My Supabase Blog</h1>
      {(!blogs || blogs.length === 0) ? (
        <p className="text-center text-gray-600">No blogs available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blogs.map((blog: any) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition">
                <img 
                  src={blog.image_url || '/placeholder.jpg'} 
                  alt={blog.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                  <p className="text-gray-700">{blog.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

