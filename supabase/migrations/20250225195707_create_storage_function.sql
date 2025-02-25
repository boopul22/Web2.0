-- Create a function to manage storage policies
CREATE OR REPLACE FUNCTION create_storage_policies(bucket_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Give public access to blog-images" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated users to update their images" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated users to delete their images" ON storage.objects;

    -- Enable RLS
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Give public access to blog-images"
    ON storage.objects FOR SELECT
    USING (bucket_id = $1);

    CREATE POLICY "Allow authenticated users to upload images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = $1
        AND auth.role() = 'authenticated'
    );

    CREATE POLICY "Allow authenticated users to update their images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = $1
        AND auth.role() = 'authenticated'
    )
    WITH CHECK (
        bucket_id = $1
        AND auth.role() = 'authenticated'
    );

    CREATE POLICY "Allow authenticated users to delete their images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = $1
        AND auth.role() = 'authenticated'
    );
END;
$$; 