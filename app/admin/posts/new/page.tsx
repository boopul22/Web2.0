'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import BlogEditor from '../../../../components/BlogEditor';
import { uploadImage } from '../../../../lib/uploadImage';

interface FormData {
  title: string;
  slug: string;
  summary: string;
  content: string;
  featured_image: string;
  published: boolean;
}

function NewPostForm() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    featured_image: '',
    published: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!session) {
          router.push('/login');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setError('Authentication failed. Please try logging in again.');
      }
    };

    checkAuth();
  }, [router, supabase]);

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

  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault();
    console.log('Starting form submission...');
    
    if (!formData.title || !formData.slug) {
      setError('Title and slug are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check authentication
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) throw new Error(`Authentication error: ${authError.message}`);
      if (!session) throw new Error('Not authenticated. Please log in.');

      // Prepare post data
      const postData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        content: formData.content?.trim() || '',
        featured_image: formData.featured_image || '',
        summary: formData.summary?.trim() || '',
        published: !saveAsDraft,
        status: !saveAsDraft ? 'published' : 'draft',
        author_id: session.user.id
      };

      // Check for duplicate slug
      const { data: existingPosts, error: slugError } = await supabase
        .from('posts')
        .select('id')
        .eq('slug', postData.slug)
        .maybeSingle();

      if (slugError) throw new Error(`Failed to check slug: ${slugError.message}`);
      if (existingPosts) throw new Error('A post with this slug already exists');

      // Create the post
      const { data: newPost, error: insertError } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error(insertError.message);
      }

      if (!newPost) throw new Error('Failed to create post: No data returned');

      console.log('Post created successfully:', newPost);
      router.push('/admin/posts');
    } catch (err) {
      console.error('Error in form submission:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Post</h1>
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

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            onBlur={() => !formData.slug && generateSlug()}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            Slug
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="block w-full rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            <button
              type="button"
              onClick={generateSlug}
              className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 hover:bg-gray-100"
            >
              Generate
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
            Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <BlogEditor 
            content={formData.content} 
            onChange={handleEditorChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Featured Image
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <button
              type="button"
              onClick={() => document.getElementById('featured-image')?.click()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={uploadingImage}
            >
              {uploadingImage ? 'Uploading...' : 'Upload Image'}
            </button>
            <input
              type="file"
              id="featured-image"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {formData.featured_image && (
              <div className="relative">
                <img 
                  src={formData.featured_image} 
                  alt="Featured" 
                  className="h-20 w-20 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            disabled={loading}
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewPostPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NewPostForm />
    </div>
  );
} 