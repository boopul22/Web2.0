'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Search, Menu, X } from 'lucide-react'
import { cn } from '../../lib/utils'

const menuItems = [
  { href: '/', label: 'Home' },
  { href: '/header-styles', label: 'Header Styles' },
  { href: '/post-features', label: 'Post Features' },
  { href: '/features', label: 'Features' },
  { href: '/contact', label: 'Contact' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial scroll position
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        hasScrolled && "bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                <path
                  d="M8 4C8 2.89543 8.89543 2 10 2H22C23.1046 2 24 2.89543 24 4V28C24 29.1046 23.1046 30 22 30H10C8.89543 30 8 29.1046 8 28V4Z"
                  className="fill-pink-500"
                />
                <path
                  d="M10 8C10 6.89543 10.8954 6 12 6H20C21.1046 6 22 6.89543 22 8V24C22 25.1046 21.1046 26 20 26H12C10.8954 26 10 25.1046 10 24V8Z"
                  className="fill-pink-600"
                />
              </svg>
              <span className={cn(
                "text-2xl font-bold transition-colors duration-300",
                hasScrolled ? "text-gray-900" : "text-white"
              )}>wavy</span>
              <span className="text-2xl text-pink-500">.</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-pink-500"
                    : hasScrolled 
                      ? "text-gray-600 hover:text-pink-500" 
                      : "text-white/90 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn(
                "p-2 transition-colors",
                hasScrolled 
                  ? "text-gray-600 hover:text-pink-500" 
                  : "text-white/90 hover:text-white"
              )}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/subscribe"
              className={cn(
                "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full transition-colors",
                hasScrolled
                  ? "text-white bg-pink-500 hover:bg-pink-600"
                  : "text-pink-500 bg-white hover:bg-gray-100"
              )}
            >
              Subscribe
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn(
                "p-2 transition-colors",
                hasScrolled 
                  ? "text-gray-600 hover:text-pink-500" 
                  : "text-white/90 hover:text-white"
              )}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "p-2 transition-colors ml-2",
                hasScrolled 
                  ? "text-gray-600 hover:text-pink-500" 
                  : "text-white/90 hover:text-white"
              )}
              aria-label="Menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-50 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <input
              type="search"
              placeholder="Search..."
              className="w-full text-lg border-none focus:outline-none focus:ring-0 bg-transparent placeholder-gray-400"
              autoFocus
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-gray-600 hover:text-pink-500 transition-colors"
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden">
          <div className={cn(
            "px-2 pt-2 pb-3 space-y-1 border-b transition-colors duration-300",
            hasScrolled ? "bg-white/95 backdrop-blur-md border-gray-200/50" : "bg-white border-gray-100"
          )}>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 text-base font-medium rounded-md ${
                  isActive(item.href)
                    ? 'text-pink-500 bg-pink-50'
                    : 'text-gray-600 hover:text-pink-500 hover:bg-pink-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/subscribe"
              className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-pink-500 rounded-full hover:bg-pink-600 transition-colors mt-4"
              onClick={() => setIsOpen(false)}
            >
              Subscribe
            </Link>
          </div>
        </div>
      )}
    </header>
  )
} 