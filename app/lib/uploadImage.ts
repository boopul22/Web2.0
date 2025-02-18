import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function uploadImage(file: File) {
  const supabase = createClientComponentClient()
  
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided')
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image must be less than 5MB')
    }

    // Create unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `uploads/${fileName.replace(/\s/g, '-').toLowerCase()}`

    // Check if bucket exists and create if it doesn't
    const { data: buckets } = await supabase.storage.listBuckets()
    const blogBucket = buckets?.find(bucket => bucket.name === 'blog-images')
    
    if (!blogBucket) {
      const { error: createBucketError } = await supabase.storage.createBucket('blog-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/*']
      })
      
      if (createBucketError) {
        console.error('Error creating bucket:', createBucketError)
        throw new Error('Failed to create storage bucket')
      }
    }

    // Upload file
    const { data, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading to Supabase:', uploadError)
      if (uploadError.message.includes('duplicate')) {
        throw new Error('A file with this name already exists')
      }
      throw new Error('Failed to upload image')
    }

    if (!data?.path) {
      throw new Error('No path returned from upload')
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(data.path)

    if (!publicUrl) {
      throw new Error('Failed to get public URL')
    }

    return publicUrl
  } catch (error) {
    console.error('Error in uploadImage:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to upload image')
  }
} 