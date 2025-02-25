-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to create posts" ON posts;
DROP POLICY IF EXISTS "Allow authenticated users to update posts" ON posts;
DROP POLICY IF EXISTS "Allow authenticated users to delete posts" ON posts;
DROP POLICY IF EXISTS "Allow everyone to read published posts" ON posts;
DROP POLICY IF EXISTS "Allow authenticated users to read all posts" ON posts;

-- Recreate policies with proper permissions
CREATE POLICY "Enable read access for all users" ON posts FOR SELECT USING (
    published = true OR auth.uid() IS NOT NULL
);

CREATE POLICY "Enable insert for authenticated users only" ON posts FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
);

CREATE POLICY "Enable update for authenticated users" ON posts FOR UPDATE USING (
    auth.role() = 'authenticated'
) WITH CHECK (
    auth.role() = 'authenticated'
);

CREATE POLICY "Enable delete for authenticated users" ON posts FOR DELETE USING (
    auth.role() = 'authenticated'
);

-- Make sure RLS is enabled
ALTER TABLE posts ENABLE ROW LEVEL SECURITY; 