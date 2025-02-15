'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

interface MenuItem {
  href: string
  label: string
  ariaLabel: string
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const menuItems: MenuItem[] = [
    { href: '/', label: 'Home', ariaLabel: 'Go to homepage' },
    { href: '/blog', label: 'Blog', ariaLabel: 'Read our blog posts' },
    { href: '/about', label: 'About', ariaLabel: 'Learn more about us' },
    { href: '/contact', label: 'Contact', ariaLabel: 'Get in touch with us' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center" aria-label="Go to homepage">
              <div className="w-8 h-8 mr-2">
                <svg viewBox="0 0 24 24" className="w-full h-full text-pink-500 fill-current">
                  <path d="M3.516 3.516c4.686-4.686 12.284-4.686 16.97 0 4.686 4.686 4.686 12.284 0 16.97-4.686 4.686-12.284 4.686-16.97 0-4.686-4.686-4.686-12.284 0-16.97zm13.789 2.06c-3.732-3.732-9.875-3.732-13.607 0-3.732 3.732-3.732 9.875 0 13.607 3.732 3.732 9.875 3.732 13.607 0 3.732-3.732 3.732-9.875 0-13.607z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Wavy</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-pink-500'
                    : 'text-gray-600 hover:text-pink-500'
                }`}
                aria-label={item.ariaLabel}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/subscribe"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 transition-colors"
              aria-label="Subscribe to our newsletter"
            >
              Subscribe
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">{isOpen ? 'Close main menu' : 'Open main menu'}</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${isOpen ? 'block' : 'hidden'} md:hidden`}
        id="mobile-menu"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="mobile-menu-button"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(item.href)
                  ? 'text-pink-500 bg-gray-50'
                  : 'text-gray-600 hover:text-pink-500 hover:bg-gray-50'
              }`}
              aria-label={item.ariaLabel}
              aria-current={isActive(item.href) ? 'page' : undefined}
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/subscribe"
            className="block w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600"
            aria-label="Subscribe to our newsletter"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Subscribe
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navigation 