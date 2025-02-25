'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import BlogEditor from '../../../../components/BlogEditor';
import { uploadImage } from '../../../../lib/uploadImage';

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featured_image: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface EditPostClientProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function EditPostClient({ params }: EditPostClientProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Post, 'id' | 'created_at' | 'updated_at'>>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    featured_image: '',
    published: false,
  });

  useEffect(() => {
    const checkAuthAndFetchPost = async () => {
      try {
        // Check auth
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        // Fetch post
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Post not found');

        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          summary: data.summary || '',
          content: data.content || '',
          featured_image: data.featured_image || '',
          published: data.published || false,
        });
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchPost();
  }, [params.id, router, supabase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };

  const generateSlug = () => {
    if (!formData.title) return;
    
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Remove duplicate hyphens
    
    setFormData((prev) => ({
      ...prev,
      slug,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setError(null);
      
      const imageUrl = await uploadImage(file);
      
      setFormData((prev) => ({
        ...prev,
        featured_image: imageUrl,
      }));
    } catch (err) {
      console.error('Error uploading featured image:', err);
      setError('Failed to upload featured image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, changePublishStatus?: boolean) => {
    e.preventDefault();
    
    if (!formData.title) {
      setError('Title is required');
      return;
    }
    
    if (!formData.slug) {
      setError('Slug is required');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      const updateData = {
        ...formData,
        updated_at: new Date().toISOString(),
      };
      
      // If we're explicitly changing publish status
      if (changePublishStatus !== undefined) {
        updateData.published = changePublishStatus;
      }
      
      const { error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', params.id);
      
      if (error) throw error;
      
      router.push('/admin/posts');
    } catch (err) {
      console.error('Error updating post:', err);
      setError('Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading post...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <button
          onClick={() => router.push('/admin/posts')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          Back to Posts
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="block w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border"
            placeholder="Post title"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug
          </label>
          <div className="flex">
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="block w-full rounded-l-md border-gray-300 shadow-sm px-4 py-2 border"
              placeholder="post-slug"
            />
            <button
              type="button"
              onClick={generateSlug}
              className="bg-gray-100 px-4 py-2 border border-l-0 rounded-r-md hover:bg-gray-200"
            >
              Generate
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
            Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border"
            placeholder="Brief summary of your post"
          ></textarea>
        </div>

        <div className="mb-6">
          <label htmlFor="featured-image" className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image
          </label>
          <div className="flex items-center space-x-4">
            <div>
              <input
                type="file"
                id="featured-image"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById('featured-image')?.click()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                disabled={uploadingImage}
              >
                {uploadingImage ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
            {formData.featured_image && (
              <div className="relative">
                <img 
                  src={formData.featured_image} 
                  alt="Featured" 
                  className="w-20 h-20 object-cover rounded-md" 
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <BlogEditor 
            content={formData.content} 
            onChange={handleEditorChange} 
          />
        </div>

        <div className="flex justify-between mt-8">
          <div>
            {formData.published ? (
              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-md disabled:opacity-50"
                disabled={saving}
              >
                Unpublish
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md disabled:opacity-50"
                disabled={saving}
              >
                Publish
              </button>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/posts')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md disabled:opacity-50"
              disabled={saving}
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 