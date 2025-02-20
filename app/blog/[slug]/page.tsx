import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Image from 'next/image'
import { Metadata } from 'next'
import { Star, ImageOff } from 'lucide-react'
import { Card, CardContent } from "../../components/ui/card"
import { SchemaMarkup } from '../../components/SchemaMarkup'
import { Breadcrumb } from '../../components/Breadcrumb'
import { TableOfContents } from '../../components/TableOfContents'
import { SocialShare } from '../../components/SocialShare'
import { PopularArticles } from '../../components/PopularArticles'
import { ViewCounter } from '../../components/ViewCounter'

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
  
  const { data: blog } = await supabase
    .from('blogs')
    .select('title,excerpt,author,created_at')
    .eq('slug', resolvedParams.slug)
    .maybeSingle()

  if (!blog) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'
  const postUrl = `${baseUrl}/blog/${resolvedParams.slug}`

  return {
    title: `${blog.title} | Wavy Blog`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: 'article',
      publishedTime: blog.created_at,
      authors: [blog.author],
      url: postUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt,
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
  
  const [{ data: blog, error }, { data: popularArticles }] = await Promise.all([
    supabase
      .from('blogs')
      .select('*')
      .eq('slug', resolvedParams.slug)
      .maybeSingle(),
    supabase
      .from('blogs')
      .select('id, title, slug, image_url, created_at')
      .neq('slug', resolvedParams.slug)
      .order('views', { ascending: false })
      .limit(3)
  ])

  if (error) {
    console.error('Error fetching blog:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Error loading blog post</p>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Post not found</p>
      </div>
    )
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'
  const postUrl = `${baseUrl}/blog/${blog.slug}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    author: {
      '@type': 'Person',
      name: blog.author,
    },
    datePublished: blog.created_at,
    dateModified: blog.updated_at || blog.created_at,
    url: postUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl
    }
  }

  return (
    <>
      <SchemaMarkup type="BlogPosting" data={schema} />
      <ViewCounter slug={blog.slug} />
      <main className="relative min-h-screen">
        <div className="relative z-0 w-full">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <div className="pt-28 pb-16">
              <Breadcrumb items={[
                { name: 'Home', url: '/' },
                { name: 'Blog', url: '/blog' },
                { name: blog.title, url: `/blog/${blog.slug}` }
              ]} />
              
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(250px,280px)_1fr] gap-4 lg:gap-8 mt-4">
                <aside className="hidden lg:block space-y-4 lg:space-y-8 lg:sticky lg:top-24">
                  <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
                    <CardContent className="p-4 sm:p-6">
                      <TableOfContents />
                    </CardContent>
                  </Card>

                  {popularArticles && popularArticles.length > 0 && (
                    <PopularArticles articles={popularArticles} />
                  )}
                </aside>

                <article className="prose prose-zinc dark:prose-invert max-w-none lg:prose-lg">
                  <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl px-4 sm:px-8 lg:px-16 py-8 lg:py-16 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
                    {blog.image_url ? (
                      <div className="relative w-full aspect-[21/9] mb-8 rounded-lg overflow-hidden">
                        <Image
                          src={blog.image_url}
                          alt={blog.title}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                    ) : (
                      <div className="relative w-full aspect-[21/9] mb-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                        <ImageOff className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                    
                    <header className="text-center mb-12 lg:mb-16">
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                        {blog.title}
                      </h1>
                      <div className="flex items-center justify-center gap-3 text-muted-foreground mb-6">
                        <span className="font-medium">{blog.author}</span>
                        <span className="text-gray-300 dark:text-gray-700">•</span>
                        <time 
                          dateTime={blog.created_at}
                          className="text-sm"
                        >
                          {new Date(blog.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                        {blog.difficulty && (
                          <>
                            <span className="text-gray-300 dark:text-gray-700">•</span>
                            <span className="flex items-center gap-1" title={`Difficulty: ${blog.difficulty} out of 5`}>
                              {Array.from({ length: blog.difficulty }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current text-pink-500" />
                              ))}
                              {Array.from({ length: 5 - blog.difficulty }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current text-gray-200 dark:text-gray-800" />
                              ))}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {blog.excerpt}
                      </p>
                    </header>

                    <div 
                      className="prose prose-zinc dark:prose-invert max-w-none lg:prose-lg
                        prose-headings:scroll-mt-20
                        prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-lg prose-img:shadow-md
                        prose-blockquote:border-l-pink-500
                        prose-code:text-pink-500 prose-code:before:content-none prose-code:after:content-none"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                    
                    <div className="mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-800/50">
                      <SocialShare 
                        url={postUrl}
                        title={blog.title}
                      />
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 