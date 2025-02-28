'use client'

import { default as NextLink } from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamically import ChevronDown with SSR disabled to prevent hydration issues
const DynamicChevronDown = dynamic(() => import('lucide-react').then(mod => mod.ChevronDown), {
  ssr: false,
  loading: () => <span className="w-4 h-4 inline-block" />
})

const menuItems = [
  { href: '/', label: 'Home' },
  { 
    href: '/header-styles', 
    label: 'Header Styles',
    hasDropdown: true 
  },
  { 
    href: '/post-features', 
    label: 'Post Features',
    hasDropdown: true 
  },
  { href: '/tag', label: '#Tag' },
  { 
    href: '/features', 
    label: 'Features',
    hasDropdown: true 
  },
  { href: '/shop', label: 'Shop' },
  { href: '/contact', label: 'Contact' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="relative w-full py-6">
      {/* Decorative Elements */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 opacity-60 mix-blend-multiply">
        <div className="w-12 h-12 bg-[#E5B8E8]/40 rounded-full blur-sm" />
        <div className="w-16 h-2 bg-[#5CCFB9]/30 rounded-full -rotate-45 ml-6 mt-3 blur-sm" />
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-60 mix-blend-multiply">
        <div className="w-14 h-14 bg-[#B8E8B8]/40 rounded-full blur-sm" />
        <div className="w-16 h-2 bg-[#5CCFB9]/30 rounded-full rotate-45 -ml-6 mt-3 blur-sm" />
      </div>

      <header className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="rounded-2xl shadow-lg shadow-gray-100/50 px-6 sm:px-8 py-4 bg-white border border-gray-100/80 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <NextLink 
              href="/" 
              className="text-2xl font-bold tracking-tight italic hover:text-[#5CCFB9] transition-all duration-300 transform hover:scale-[1.02]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              groovy
            </NextLink>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:gap-10">
              {menuItems.map((item) => (
                <NextLink
                  key={item.href}
                  href={item.href}
                  className={`text-[15px] font-medium hover:text-[#5CCFB9] transition-all duration-300 inline-flex items-center group relative ${
                    isActive(item.href) ? 'text-[#5CCFB9]' : 'text-gray-600'
                  }`}
                >
                  <span className="relative">
                    {item.label}
                    <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-[#5CCFB9] transition-all duration-300 group-hover:w-full ${
                      isActive(item.href) ? 'w-full' : ''
                    }`} />
                  </span>
                  {item.hasDropdown && mounted && (
                    <span className="ml-1.5 flex items-center transition-transform duration-300 group-hover:translate-y-[2px]">
                      <DynamicChevronDown className="w-4 h-4" />
                    </span>
                  )}
                </NextLink>
              ))}
            </nav>

            {/* Social Links */}
            <div className="hidden lg:inline-flex items-center gap-6">
              <NextLink href="https://facebook.com" className="text-gray-400 hover:text-[#5CCFB9] transition-all duration-300 transform hover:scale-110">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </NextLink>
              <NextLink href="https://twitter.com" className="text-gray-400 hover:text-[#5CCFB9] transition-all duration-300 transform hover:scale-110">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </NextLink>
              <NextLink href="https://instagram.com" className="text-gray-400 hover:text-[#5CCFB9] transition-all duration-300 transform hover:scale-110">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </NextLink>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-gray-50/80 transition-colors relative group"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-[#5CCFB9] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white/95 backdrop-blur-xl">
          <div className="pt-24 pb-8 px-6">
            <nav className="flex flex-col space-y-6">
              {menuItems.map((item) => (
                <NextLink
                  key={item.href}
                  href={item.href}
                  className={`text-lg font-medium flex items-center justify-between transition-all duration-300 group ${
                    isActive(item.href) ? 'text-[#5CCFB9]' : 'text-gray-600'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="relative group-hover:text-[#5CCFB9] transition-colors duration-300">
                    {item.label}
                    <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-[#5CCFB9] transition-all duration-300 group-hover:w-full ${
                      isActive(item.href) ? 'w-full' : ''
                    }`} />
                  </span>
                  {item.hasDropdown && mounted && (
                    <span className="flex items-center ml-3 transition-transform duration-300 group-hover:translate-x-1">
                      <DynamicChevronDown className="w-5 h-5" />
                    </span>
                  )}
                </NextLink>
              ))}
            </nav>
            
            {/* Mobile Social Links */}
            <div className="flex items-center gap-8 mt-10 pt-8 border-t border-gray-100">
              <NextLink href="https://facebook.com" className="text-gray-400 hover:text-[#5CCFB9] transition-all duration-300 transform hover:scale-110">
                <svg className="w-[22px] h-[22px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </NextLink>
              <NextLink href="https://twitter.com" className="text-gray-400 hover:text-[#5CCFB9] transition-all duration-300 transform hover:scale-110">
                <svg className="w-[22px] h-[22px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </NextLink>
              <NextLink href="https://instagram.com" className="text-gray-400 hover:text-[#5CCFB9] transition-all duration-300 transform hover:scale-110">
                <svg className="w-[22px] h-[22px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </NextLink>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 