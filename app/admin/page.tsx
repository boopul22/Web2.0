"use client";

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import BlogForm from './blogs/components/BlogForm';
import ErrorBoundary from '../components/ErrorBoundary';
import { registerGlobalErrorHandlers } from '../lib/handleClientError';
import { FiEdit3, FiImage, FiUsers, FiEye } from 'react-icons/fi';

export default function AdminPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [user, setUser] = useState<User | null>(null);

  // States for login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();
  }, [supabase]);

  useEffect(() => {
    registerGlobalErrorHandlers();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingLogin(true);
    setLoginError("");
    
    const { error, data: { session } } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setLoginError(error.message);
    } else {
      setUser(session?.user ?? null);
    }
    setLoadingLogin(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-10 p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-semibold">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          {loginError && <div className="text-red-600">{loginError}</div>}
          <button
            type="submit"
            disabled={loadingLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {loadingLogin ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <Link
          href="/admin/posts/editor"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create New Post
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/posts" className="block">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Posts</p>
                <p className="text-2xl font-semibold">24</p>
              </div>
              <FiEdit3 className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </Link>
        
        <Link href="/admin/media" className="block">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Media Items</p>
                <p className="text-2xl font-semibold">156</p>
              </div>
              <FiImage className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </Link>

        <Link href="/admin/users" className="block">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Users</p>
                <p className="text-2xl font-semibold">12</p>
              </div>
              <FiUsers className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Page Views</p>
              <p className="text-2xl font-semibold">2.4K</p>
            </div>
            <FiEye className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-800">New post published</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700">View</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/posts/editor" className="block">
              <button className="w-full p-4 text-center border rounded-lg hover:bg-gray-50">
                <FiEdit3 className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <span className="text-sm font-medium">New Post</span>
              </button>
            </Link>
            <Link href="/admin/media" className="block">
              <button className="w-full p-4 text-center border rounded-lg hover:bg-gray-50">
                <FiImage className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <span className="text-sm font-medium">Upload Media</span>
              </button>
            </Link>
            <Link href="/admin/users" className="block">
              <button className="w-full p-4 text-center border rounded-lg hover:bg-gray-50">
                <FiUsers className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <span className="text-sm font-medium">Add User</span>
              </button>
            </Link>
            <Link href="/" className="block">
              <button className="w-full p-4 text-center border rounded-lg hover:bg-gray-50">
                <FiEye className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                <span className="text-sm font-medium">View Site</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 