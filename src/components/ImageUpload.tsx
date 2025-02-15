import { useState, useCallback } from 'react'
import { Upload, X } from 'lucide-react'
import { uploadImage } from '@/lib/uploadImage'

interface ImageUploadProps {
  onUpload: (url: string) => void
  className?: string
}

export default function ImageUpload({ onUpload, className = '' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleUpload = useCallback(async (file: File) => {
    setIsUploading(true)
    setError(null)
    try {
      const url = await uploadImage(file)
      onUpload(url)
      setPreview(url)
    } catch (err) {
      setError('Failed to upload image. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }, [onUpload])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleUpload(file)
    }
  }, [handleUpload])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center ${
          isUploading ? 'bg-gray-50' : 'hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded"
            />
            <button
              onClick={() => {
                setPreview(null)
                onUpload('')
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="text-sm text-gray-600">
              {isUploading ? (
                'Uploading...'
              ) : (
                <>
                  <label className="cursor-pointer text-blue-500 hover:text-blue-600">
                    Click to upload
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleUpload(file)
                        }
                      }}
                    />
                  </label>
                  {' or drag and drop'}
                </>
              )}
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
} 