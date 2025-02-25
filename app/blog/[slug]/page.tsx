import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Image from 'next/image'
import { Metadata } from 'next'
import { ImageOff } from 'lucide-react'
import Link from 'next/link'

interface PageParams extends Promise<any> {
  slug: string
}

interface Props {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const supabase = createServerComponentClient({
    cookies,
  })
  
  const { data: post } = await supabase
    .from('posts')
    .select('title,summary,author_id,created_at')
    .eq('slug', resolvedParams.slug)
    .maybeSingle()

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'
  const postUrl = `${baseUrl}/blog/${resolvedParams.slug}`

  return {
    title: `${post.title} | Blog`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.created_at,
      url: postUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
    },
    alternates: {
      canonical: postUrl
    }
  }
}

export default async function BlogPost({ params }: Props) {
  const resolvedParams = await params
  const cookieStore = cookies()
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  })
  
  const [{ data: post, error }, { data: recentPosts }] = await Promise.all([
    supabase
      .from('posts')
      .select('*')
      .eq('slug', resolvedParams.slug)
      .eq('published', true)
      .maybeSingle(),
    supabase
      .from('posts')
      .select('id, title, slug, featured_image, created_at')
      .eq('published', true)
      .neq('slug', resolvedParams.slug)
      .order('created_at', { ascending: false })
      .limit(3)
  ])

  if (error) {
    console.error('Error fetching post:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Error loading blog post</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Post not found</p>
      </div>
    )
  }

  return (
    <main className="relative min-h-screen bg-gray-50">
      <div className="relative z-0 w-full">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="pt-28 pb-16">
            {/* Breadcrumb */}
            <nav className="flex mb-8" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href="/" className="text-gray-700 hover:text-gray-900">
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-500">{post.title}</span>
                  </div>
                </li>
              </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
              <article className="bg-white rounded-2xl shadow-sm p-6 md:p-8 lg:p-10">
                {post.featured_image ? (
                  <div className="relative w-full aspect-[21/9] mb-8 rounded-xl overflow-hidden">
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="relative w-full aspect-[21/9] mb-8 rounded-xl bg-gray-100 flex items-center justify-center">
                    <ImageOff className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                <header className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                    {post.title}
                  </h1>
                  <div className="flex items-center gap-3 text-gray-600 mb-6">
                    <time dateTime={post.created_at}>
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    <span>•</span>
                    <span>{Math.ceil(post.content.length / 1000)} min read</span>
                  </div>
                  {post.summary && (
                    <p className="text-lg text-gray-600 mb-6">
                      {post.summary}
                    </p>
                  )}
                </header>

                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </article>

              {/* Sidebar with recent posts */}
              <aside className="space-y-8">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
                  <div className="space-y-4">
                    {recentPosts?.map((recentPost) => (
                      <Link
                        key={recentPost.id}
                        href={`/blog/${recentPost.slug}`}
                        className="block group"
                      >
                        <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-2">
                          {recentPost.featured_image ? (
                            <Image
                              src={recentPost.featured_image}
                              alt={recentPost.title}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                              <ImageOff className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                          {recentPost.title}
                        </h3>
                        <time className="text-sm text-gray-500" dateTime={recentPost.created_at}>
                          {new Date(recentPost.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 