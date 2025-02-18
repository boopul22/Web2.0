'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Search, Menu, X } from 'lucide-react'
import { cn } from '../../lib/utils'

const menuItems = [
  { href: '/', label: 'Home', icon: 'Home' },
  { href: '/blog', label: 'Blog', icon: 'BookOpen' },
  { href: '/features', label: 'Features', icon: 'Sparkles' },
  { href: '/about', label: 'About', icon: 'Users' },
  { href: '/contact', label: 'Contact', icon: 'Mail' },
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

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (isOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, isSearchOpen])

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500",
        hasScrolled 
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/20 dark:border-gray-800/20 shadow-sm" 
          : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg"
      )}
      role="banner"
    >
      {/* Navigation Background Overlay */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          hasScrolled 
            ? "opacity-100" 
            : "opacity-0"
        )}
        aria-hidden="true"
      />

      {/* Navigation Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center transition-all duration-300 hover:scale-105 focus:scale-105 focus:outline-none"
              aria-label="Go to homepage"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <path
                    d="M8 4C8 2.89543 8.89543 2 10 2H22C23.1046 2 24 2.89543 24 4V28C24 29.1046 23.1046 30 22 30H10C8.89543 30 8 29.1046 8 28V4Z"
                    className="fill-pink-500 dark:fill-pink-400"
                  />
                  <path
                    d="M10 8C10 6.89543 10.8954 6 12 6H20C21.1046 6 22 6.89543 22 8V24C22 25.1046 21.1046 26 20 26H12C10.8954 26 10 25.1046 10 24V8Z"
                    className="fill-pink-600 dark:fill-pink-500"
                  />
                </svg>
                <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors duration-300">
                  wavy
                </span>
                <span className="text-2xl text-pink-500 dark:text-pink-400">.</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav 
              className="hidden lg:flex lg:items-center lg:space-x-1"
              role="navigation"
              aria-label="Main navigation"
            >
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                    "hover:bg-gray-100/80 dark:hover:bg-gray-800/80",
                    "focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                    isActive(item.href)
                      ? "text-pink-500 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  )}
                  aria-current={isActive(item.href) ? 'page' : undefined}
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
                  "p-2.5 transition-all duration-300 rounded-full",
                  "hover:bg-gray-100/80 dark:hover:bg-gray-800/80",
                  "focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                  "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                )}
                aria-label={isSearchOpen ? "Close search" : "Open search"}
                aria-expanded={isSearchOpen}
              >
                <Search className="w-5 h-5" aria-hidden="true" />
              </button>
              <Link
                href="/subscribe"
                className={cn(
                  "inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300",
                  "transform hover:scale-105 active:scale-95",
                  "focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                  "text-white bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700"
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
                  "p-2.5 transition-all duration-300 rounded-full",
                  "hover:bg-gray-100/80 dark:hover:bg-gray-800/80",
                  "focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                  "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                )}
                aria-label={isSearchOpen ? "Close search" : "Open search"}
                aria-expanded={isSearchOpen}
              >
                <Search className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "p-2.5 ml-2 transition-all duration-300 rounded-full",
                  "hover:bg-gray-100/80 dark:hover:bg-gray-800/80",
                  "focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                  "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                )}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <X className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg z-[60] transition-all duration-300"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <div className="container mx-auto px-4 sm:px-6 pt-24">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search articles..."
                className={cn(
                  "w-full h-14 pl-12 pr-4 text-lg rounded-2xl",
                  "border-2 border-gray-200 dark:border-gray-700",
                  "bg-white dark:bg-gray-800",
                  "text-gray-900 dark:text-gray-100",
                  "placeholder-gray-400 dark:placeholder-gray-500",
                  "focus:outline-none focus:border-pink-500 dark:focus:border-pink-400",
                  "transition-all duration-300"
                )}
                autoFocus
                aria-label="Search articles"
              />
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className={cn(
                "absolute top-4 right-4 p-2.5 rounded-full",
                "text-gray-500 dark:text-gray-400",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "focus:outline-none focus:ring-2 focus:ring-pink-500/50",
                "transition-all duration-300"
              )}
              aria-label="Close search"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-[60] bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg transition-all duration-300"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          <nav 
            className="h-full pt-20 pb-6 px-4 overflow-y-auto"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-base font-medium rounded-xl mb-2",
                  "transition-all duration-300",
                  "focus:outline-none focus:ring-2 focus:ring-pink-500/50",
                  isActive(item.href)
                    ? "text-pink-500 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                onClick={() => setIsOpen(false)}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/subscribe"
              className={cn(
                "block w-full text-center mt-6 px-6 py-3",
                "text-sm font-medium rounded-xl",
                "text-white bg-pink-500 dark:bg-pink-600",
                "hover:bg-pink-600 dark:hover:bg-pink-700",
                "focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:ring-offset-2",
                "transform transition-all duration-300",
                "hover:scale-[1.02] active:scale-[0.98]"
              )}
              onClick={() => setIsOpen(false)}
            >
              Subscribe
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
} 