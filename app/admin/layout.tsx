import { ReactNode } from 'react';
import Link from 'next/link';
import { FiHome, FiFileText, FiImage, FiUsers, FiSettings, FiBox } from 'react-icons/fi';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/admin" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <FiHome className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/posts" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <FiFileText className="w-5 h-5 mr-3" />
                Posts
              </Link>
            </li>
            <li>
              <Link href="/admin/media" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <FiImage className="w-5 h-5 mr-3" />
                Media Library
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <FiUsers className="w-5 h-5 mr-3" />
                Users
              </Link>
            </li>
            <li>
              <Link href="/admin/plugins" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <FiBox className="w-5 h-5 mr-3" />
                Plugins
              </Link>
            </li>
            <li>
              <Link href="/admin/settings" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <FiSettings className="w-5 h-5 mr-3" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 