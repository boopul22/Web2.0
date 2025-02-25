'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';

interface Post {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  published: boolean;
}

export default function AdminPosts() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schemaIssue, setSchemaIssue] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Check auth
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Auth session error:', sessionError);
          setError('Authentication error: ' + sessionError.message);
          setLoading(false);
          return;
        }
        
        if (!session) {
          console.log('No active session, redirecting to login');
          router.push('/login');
          return;
        }

        // Fetch posts
        console.log('Fetching posts...');
        const { data, error: postsError } = await supabase
          .from('posts')
          .select('id, title, slug, created_at, published')
          .order('created_at', { ascending: false });

        if (postsError) {
          console.error('Supabase query error:', postsError);
          
          // Check for schema issues
          if (postsError.message.includes('column') || postsError.message.includes('schema') || 
              postsError.message.includes('published')) {
            setSchemaIssue(true);
            setError('Database schema issue: ' + postsError.message + 
                    '. The posts table might be missing the published column.');
          } else {
            setError('Failed to load posts: ' + postsError.message);
          }
          
          setLoading(false);
          return;
        }
        
        console.log('Posts fetched successfully:', data?.length || 0);
        setPosts(data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        // More detailed error message
        const errorMessage = err instanceof Error 
          ? `Failed to load posts: ${err.message}` 
          : 'Failed to load posts: Unknown error';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [router, supabase]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove from state
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ published: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update state
      setPosts(posts.map(post => 
        post.id === id ? { ...post, published: !currentStatus } : post
      ));
    } catch (err) {
      console.error('Error updating post:', err);
      setError('Failed to update post status');
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading posts...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => router.push('/admin/posts/new')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Create New Post
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
          {schemaIssue && (
            <div className="mt-2">
              <p className="font-semibold">How to fix:</p>
              <ol className="list-decimal pl-5 mt-1">
                <li>Log in to your Supabase dashboard</li>
                <li>Go to the SQL Editor</li>
                <li>Run this SQL command: <code className="bg-red-50 px-1 py-0.5 rounded">ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT FALSE;</code></li>
                <li>Refresh this page</li>
              </ol>
            </div>
          )}
        </div>
      )}

      {posts.length === 0 && !loading ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-600 mb-2">No posts found</h2>
          <p className="mb-6">Get started by creating your first blog post</p>
          <button
            onClick={() => router.push('/admin/posts/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Create New Post
          </button>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {post.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {post.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {format(new Date(post.created_at), 'MMM d, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      post.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleTogglePublish(post.id, post.published)}
                        className={`${
                          post.published 
                            ? 'text-yellow-600 hover:text-yellow-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {post.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button 
                        onClick={() => router.push(`/admin/posts/${post.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 