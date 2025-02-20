'use client'

import React, { useEffect, useState } from 'react'

interface ViewCounterProps {
  slug: string
}

export function ViewCounter({ slug }: ViewCounterProps) {
  const [hasIncremented, setHasIncremented] = useState(false)

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

    // Only increment views if we haven't done so already
    if (typeof window !== 'undefined' && !hasIncremented) {
      const viewedPosts = JSON.parse(localStorage.getItem('viewedPosts') || '[]')
      if (!viewedPosts.includes(slug)) {
        incrementViews()
        localStorage.setItem('viewedPosts', JSON.stringify([...viewedPosts, slug]))
        setHasIncremented(true)
      }
    }
  }, [slug, hasIncremented])

  // This component doesn't render anything
  return null
} 