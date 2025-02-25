import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function uploadImage(file: File, bucket: string = 'blog-images'): Promise<string> {
  const supabase = createClientComponentClient();
  
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image must be less than 5MB');
    }

    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('You must be signed in to upload images');
    }

    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName.replace(/\s/g, '-').toLowerCase()}`;

    // Note: Bucket must exist and be configured with proper permissions
    // Upload the file to Supabase storage using regular client
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading to Supabase:', error);
      if (error.message.includes('duplicate')) {
        throw new Error('A file with this name already exists');
      }
      throw new Error('Failed to upload image: ' + error.message);
    }

    if (!data?.path) {
      throw new Error('No path returned from upload');
    }

    // Get the public URL using regular client
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    if (!publicUrl) {
      throw new Error('Failed to get public URL');
    }

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
} 