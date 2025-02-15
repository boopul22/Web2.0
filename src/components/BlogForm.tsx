'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import RichEditor from './RichEditor'
import ImageUpload from './ImageUpload'

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
  }
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '')
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '')
  const [category, setCategory] = useState(initialData?.category || '')
  const [readTime, setReadTime] = useState(initialData?.readTime || 5)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

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
    } catch (err: any) {
      console.error('Error saving blog:', err)
      setError(err.message || 'Failed to save blog')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
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
        <RichEditor
          content={content}
          onChange={setContent}
          placeholder="Write your blog post content here..."
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Featured Image
        </label>
        <ImageUpload
          onUpload={setImageUrl}
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

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : initialData ? 'Update Blog' : 'Create Blog'}
      </button>
    </form>
  )
} 