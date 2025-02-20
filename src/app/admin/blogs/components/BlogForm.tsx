'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Editor from '../../../../../components/RichEditor'
import ImageUpload from '../../../../../components/ImageUpload'

interface BlogFormProps {
  initialData?: {
    id?: string
    title: string
    content: string
    excerpt: string
    imageUrl: string
    category: string
    readTime: number
    slug?: string
    seoTitle?: string
    seoDescription?: string
    status?: 'draft' | 'published'
  }
}

interface SupabaseError {
  message: string
  details?: string
  hint?: string
  code?: string
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '')
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '')
  const [category, setCategory] = useState(initialData?.category || '')
  const [readTime, setReadTime] = useState(initialData?.readTime || 5)
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || '')
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || '')
  const [status, setStatus] = useState<'draft' | 'published'>(initialData?.status || 'draft')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  async function handleSubmit(e: FormEvent, saveAsDraft = false) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      // Validate required fields for publishing
      if (!saveAsDraft) {
        if (!title) throw new Error('Title is required')
        if (!content) throw new Error('Content is required')
        if (!excerpt) throw new Error('Excerpt is required')
        if (!imageUrl) throw new Error('Featured image is required')
        if (!category) throw new Error('Category is required')
        if (!seoTitle) throw new Error('SEO title is required')
        if (!seoDescription) throw new Error('SEO description is required')
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const blog = {
        title,
        content,
        excerpt,
        image_url: imageUrl,
        category,
        read_time: `${readTime} min`,
        author_id: user.id,
        slug,
        seo_title: seoTitle,
        seo_description: seoDescription,
        status: saveAsDraft ? 'draft' : 'published',
        published_at: saveAsDraft ? null : new Date().toISOString()
      }

      if (initialData?.id) {
        const { error: updateError } = await supabase
          .from('blogs')
          .update(blog)
          .eq('id', initialData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('blogs')
          .insert([blog])

        if (insertError) throw insertError
      }

      router.push('/admin')
      router.refresh()
    } catch (err: unknown) {
      const error = err as Error
      console.error('Error saving blog:', error)
      setError(error.message || 'Failed to save blog')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="max-w-4xl mx-auto space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <Editor
          content={content}
          onChange={setContent}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Featured Image
        </label>
        <ImageUpload
          onImageSelect={async (file) => {
            try {
              const fileExt = file.name.split('.').pop()
              const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
              const filePath = `blog-images/${fileName}`

              const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file)

              if (uploadError) throw uploadError

              const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath)

              setImageUrl(publicUrl)
            } catch (error) {
              console.error('Error uploading image:', error)
              setError('Failed to upload image')
            }
          }}
          currentImage={imageUrl}
          className="w-full"
        />
        {imageUrl && (
          <p className="text-sm text-gray-500 mt-1">
            Current image: {imageUrl}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          <option value="Technology">Technology</option>
          <option value="Health">Health</option>
          <option value="Inspiration">Inspiration</option>
          <option value="Music">Music</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="readTime" className="block text-sm font-medium text-gray-700">
          Read Time (minutes)
        </label>
        <input
          type="number"
          id="readTime"
          value={readTime}
          onChange={(e) => setReadTime(parseInt(e.target.value))}
          min="1"
          className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      {/* SEO Section */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900">SEO Settings</h3>
        
        <div className="space-y-2">
          <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700">
            SEO Title
          </label>
          <input
            type="text"
            id="seoTitle"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            maxLength={60}
          />
          <p className="text-sm text-gray-500">{seoTitle.length}/60 characters</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700">
            SEO Description
          </label>
          <textarea
            id="seoDescription"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={3}
            className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            maxLength={160}
          />
          <p className="text-sm text-gray-500">{seoDescription.length}/160 characters</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={isLoading}
          className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading && status === 'draft' ? 'Saving...' : 'Save as Draft'}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading && status === 'published' ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </form>
  )
} 