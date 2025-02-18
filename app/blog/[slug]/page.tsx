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
  const supabase = createServerComponentClient({
    cookies,
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
      <div className="min-h-screen bg-transparent dark:bg-transparent py-4 sm:py-6 lg:py-8 px-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Breadcrumb items={[
            { name: 'Home', url: '/' },
            { name: 'Blog', url: '/blog' },
            { name: blog.title, url: `/blog/${blog.slug}` }
          ]} />
          
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(250px,280px)_1fr] gap-4 lg:gap-8 mt-4">
            <aside className="hidden lg:block space-y-4 lg:space-y-8">
              <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-zinc-200/50 dark:border-zinc-800/50">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <TableOfContents />
                </CardContent>
              </Card>

              {popularArticles && popularArticles.length > 0 && (
                <PopularArticles articles={popularArticles} />
              )}
            </aside>

            <article className="prose prose-zinc dark:prose-invert max-w-none">
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl px-4 sm:px-8 lg:px-16 py-8 lg:py-16 border border-zinc-200/50 dark:border-zinc-800/50">
                {blog.image_url ? (
                  <div className="relative w-full h-64 sm:h-80 lg:h-96 mb-8 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={blog.image_url}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gray-900/10 dark:bg-gray-900/20" />
                  </div>
                ) : (
                  <div className="relative w-full h-64 sm:h-80 lg:h-96 mb-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <ImageOff className="w-12 h-12 text-gray-400" />
                    <span className="sr-only">No image available</span>
                  </div>
                )}
                <header className="text-center mb-8 lg:mb-12">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">{blog.title}</h1>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
                    <span>{blog.author}</span>
                    <span>•</span>
                    <time dateTime={blog.created_at}>
                      {new Date(blog.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    {blog.difficulty && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          {Array.from({ length: blog.difficulty }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-lg text-muted-foreground">{blog.excerpt}</p>
                </header>

                <div 
                  className="prose prose-zinc dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
                
                <div className="mt-8 pt-8 border-t">
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
    </>
  )
} 