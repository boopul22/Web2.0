import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function uploadImage(file: File) {
  try {
    const supabase = createClientComponentClient()
    
    // Create unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `${fileName.replace(/\s/g, '-').toLowerCase()}`

    // Upload file
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(data.path)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
} 