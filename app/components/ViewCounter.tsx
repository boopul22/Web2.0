'use client'

import { useEffect } from 'react'

interface ViewCounterProps {
  slug: string
}

export function ViewCounter({ slug }: ViewCounterProps) {
  useEffect(() => {
    const incrementViews = async () => {
      try {
        await fetch('/api/blogs/increment-views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug }),
        })
      } catch (error) {
        console.error('Error incrementing views:', error)
      }
    }

    // Only increment views if the user hasn't viewed this post in this session
    const viewedPosts = JSON.parse(sessionStorage.getItem('viewedPosts') || '[]')
    if (!viewedPosts.includes(slug)) {
      incrementViews()
      sessionStorage.setItem('viewedPosts', JSON.stringify([...viewedPosts, slug]))
    }
  }, [slug])

  // This component doesn't render anything
  return null
} 