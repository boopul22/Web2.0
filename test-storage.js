import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://efjhzxkrgobamihluyok.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmamh6eGtyZ29iYW1paGx1eW9rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTMwNjUzOSwiZXhwIjoyMDU0ODgyNTM5fQ.8uG1WbTJ0Cq0WMjhQ_GfkiRCCL9NycaKvVBGPujQrOE'
)

async function setupStorage() {
  try {
    // First, ensure the bucket exists
    const { data: bucketData, error: bucketError } = await supabase
      .storage
      .createBucket('blog-images', {
        public: true,
        fileSizeLimit: 5242880,
        allowedMimeTypes: ['image/*']
      })

    if (bucketError && !bucketError.message.includes('already exists')) {
      console.error('Error creating bucket:', bucketError.message)
      return
    }

    // Apply the policies using raw SQL
    const { error: policiesError } = await supabase.rpc('apply_storage_policies', {
      sql: `
        -- Drop existing policies
        DROP POLICY IF EXISTS "Give public access to blog-images" ON storage.objects;
        DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
        DROP POLICY IF EXISTS "Allow authenticated users to update their images" ON storage.objects;
        DROP POLICY IF EXISTS "Allow authenticated users to delete their images" ON storage.objects;

        -- Enable RLS
        ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Give public access to blog-images"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'blog-images');

        CREATE POLICY "Allow authenticated users to upload images"
        ON storage.objects FOR INSERT
        WITH CHECK (
            bucket_id = 'blog-images'
            AND auth.role() = 'authenticated'
        );

        CREATE POLICY "Allow authenticated users to update their images"
        ON storage.objects FOR UPDATE
        USING (
            bucket_id = 'blog-images'
            AND auth.role() = 'authenticated'
        )
        WITH CHECK (
            bucket_id = 'blog-images'
            AND auth.role() = 'authenticated'
        );

        CREATE POLICY "Allow authenticated users to delete their images"
        ON storage.objects FOR DELETE
        USING (
            bucket_id = 'blog-images'
            AND auth.role() = 'authenticated'
        );
      `
    })

    if (policiesError) {
      console.error('Error applying policies:', policiesError.message)
      return
    }

    console.log('Storage setup completed successfully')

    // Verify the bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    console.log('Available buckets:', buckets)

  } catch (error) {
    console.error('Error:', error.message)
  }
}

setupStorage() 