import { useState, useCallback } from 'react'
import { Upload, X } from 'lucide-react'
import { uploadImage } from '@/lib/uploadImage'

interface ImageUploadProps {
  onUpload: (url: string) => void
  className?: string
  maxSize?: number // in MB
}

export default function ImageUpload({ 
  onUpload, 
  className = '',
  maxSize = 5 // default to 5MB
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleUpload = useCallback(async (file: File) => {
    setIsUploading(true)
    setError(null)

    // Validate file
    const validateFile = (file: File): string | null => {
      if (!file.type.startsWith('image/')) {
        return 'Please upload an image file'
      }

      if (file.size > maxSize * 1024 * 1024) {
        return `Image must be less than ${maxSize}MB`
      }

      return null
    }

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      setIsUploading(false)
      return
    }

    try {
      const url = await uploadImage(file)
      onUpload(url)
      setPreview(url)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image'
      setError(errorMessage)
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }, [onUpload, maxSize])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleUpload(file)
    }
  }, [handleUpload])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const handleRemove = useCallback(() => {
    setPreview(null)
    onUpload('')
    setError(null)
  }, [onUpload])

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors
          ${isUploading ? 'bg-gray-50 border-gray-300' : 'hover:bg-gray-50 border-gray-200 hover:border-gray-300'}
          ${error ? 'border-red-300' : ''}`}
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
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className={`mx-auto h-12 w-12 ${error ? 'text-red-400' : 'text-gray-400'}`} />
            <div className="text-sm text-gray-600">
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Uploading...</span>
                </div>
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
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to {maxSize}MB
            </p>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
} 