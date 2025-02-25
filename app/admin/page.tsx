'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }
      
      // You might want to check if the user has admin role here
      // For example: 
      // const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      // if (data?.role !== 'admin') {
      //   router.push('/');
      //   return;
      // }
      
      setUser(session.user);
      setLoading(false);
    };

    checkUser();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading...</h2>
          <p>Please wait while we check your credentials</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Blog Posts</h2>
          <p className="mb-4">Manage your existing blog posts or create new ones.</p>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/admin/posts')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              View All Posts
            </button>
            <button
              onClick={() => router.push('/admin/posts/new')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Create New Post
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Media Library</h2>
          <p className="mb-4">Manage images and other media files.</p>
          <button
            onClick={() => router.push('/admin/media')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
          >
            Manage Media
          </button>
        </div>
      </div>
    </div>
  );
} 