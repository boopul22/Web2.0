interface SchemaMarkupProps {
  type: string
  data: Record<string, any>
}

export function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': type,
          ...data,
        }),
      }}
    />
  )
} 