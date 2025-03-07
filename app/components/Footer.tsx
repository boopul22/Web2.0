'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Post {
  title: string;
  slug: string;
  date: string;
  thumbnail?: string;
}

export default function Footer() {
  const recentPosts: Post[] = [
    {
      title: "Understanding Web Performance",
      slug: "understanding-web-performance",
      date: "March 15, 2024",
      thumbnail: "/images/web-performance-thumbnail.jpg"
    },
    {
      title: "The Future of AI",
      slug: "future-of-ai",
      date: "March 10, 2024",
      thumbnail: "/images/ai-thumbnail.jpg"
    },
    {
      title: "Building Scalable Systems",
      slug: "building-scalable-systems",
      date: "March 5, 2024",
      thumbnail: "/images/scalable-systems-thumbnail.jpg"
    }
  ];

  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/images/wavy-logo.svg"
                alt="Wavy"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-600 mt-4">
              A super modern theme following the latest trends with premium
              Membership and fully compatible with Ghost.
            </p>
            <p className="text-gray-600">
              Check more themes like this on{" "}
              <a
                href="https://estudiopatagon.com"
                className="text-pink-600 hover:text-pink-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                estudiopatagon.com
              </a>
            </p>
            <div className="flex items-center space-x-2 mt-6">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                Get Started
              </button>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <span className="text-pink-600 mr-2">〜</span>
              Quick Links
            </h3>
            <nav className="space-y-3">
              <Link href="/" className="block text-gray-600 hover:text-pink-600">
                Home
              </Link>
              <Link href="/features" className="block text-gray-600 hover:text-pink-600">
                Features
              </Link>
              <Link href="/contact" className="block text-gray-600 hover:text-pink-600">
                Contact
              </Link>
              <Link href="/privacy-policy" className="block text-gray-600 hover:text-pink-600">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-gray-600 hover:text-pink-600">
                Terms & Conditions
              </Link>
            </nav>
          </div>

          {/* Recent Posts Section */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <span className="text-pink-600 mr-2">〜</span>
              Recent Posts
            </h3>
            <div className="space-y-6">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="flex gap-4 group"
                >
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No image</span>
                  </div>
                  <div>
                    <h4 className="text-gray-800 group-hover:text-pink-600 transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      — {post.date}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 