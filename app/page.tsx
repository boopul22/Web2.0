import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  image_url: string
  created_at: string
  author: string
}

export const metadata = {
  title: 'Wavy Blog - Latest Articles and Insights',
  description: 'Discover the latest articles and insights on our blog. Stay updated with trending topics and expert opinions.',
  keywords: 'blog, articles, insights, trending topics',
}

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
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Latest Articles Section */}
        <section aria-labelledby="latest-articles-heading">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8">
                <svg viewBox="0 0 24 24" className="w-full h-full text-pink-500 fill-current">
                  <path d="M3.516 3.516c4.686-4.686 12.284-4.686 16.97 0 4.686 4.686 4.686 12.284 0 16.97-4.686 4.686-12.284 4.686-16.97 0-4.686-4.686-4.686-12.284 0-16.97zm13.789 2.06c-3.732-3.732-9.875-3.732-13.607 0-3.732 3.732-3.732 9.875 0 13.607 3.732 3.732 9.875 3.732 13.607 0 3.732-3.732 3.732-9.875 0-13.607z"/>
                </svg>
              </div>
              <h1 id="latest-articles-heading" className="text-3xl font-bold text-navy-900">
                Latest Articles
              </h1>
            </div>

            {(!blogs || blogs.length === 0) ? (
              <p className="text-center text-gray-600">No articles available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog: Blog) => (
                  <article key={blog.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                    <Link href={`/blog/${blog.slug}`} className="block h-full">
                      <div className="relative h-56 w-full">
                        <Image
                          src={blog.image_url || '/placeholder.jpg'}
                          alt={blog.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                          {blog.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center gap-3 mt-auto">
                          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                            <Image
                              src="/default-avatar.png"
                              alt="Author"
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {blog.author || 'Anonymous'}
                            </p>
                            <time dateTime={blog.created_at} className="text-sm text-gray-500">
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
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

