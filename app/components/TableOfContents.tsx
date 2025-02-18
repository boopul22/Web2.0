'use client'

import { useEffect, useState } from 'react'
import { cn } from '../../lib/utils'

interface Heading {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('h1, h2, h3'))
      .filter((element): element is HTMLElement => element instanceof HTMLElement)
      .map((element) => {
        const level = parseInt(element.tagName[1])
        const id = element.id || element.innerText.toLowerCase().replace(/\s+/g, '-')
        element.id = id
        return {
          id,
          text: element.innerText,
          level
        }
      })

    setHeadings(elements)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66% 0px' }
    )

    elements.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  if (headings.length === 0) return null

  return (
    <nav className="space-y-2">
      <h4 className="font-semibold mb-4 text-sm">Table of Contents</h4>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
          >
            <a
              href={`#${heading.id}`}
              className={cn(
                'block text-muted-foreground hover:text-foreground transition-colors py-1',
                activeId === heading.id && 'text-foreground font-medium'
              )}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: 'smooth'
                })
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
} 