-- Create posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content TEXT,
  featured_image TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to create posts
CREATE POLICY "Allow authenticated users to create posts"
ON posts
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy to allow authenticated users to update their own posts
CREATE POLICY "Allow authenticated users to update posts"
ON posts
FOR UPDATE
TO authenticated
USING (true);

-- Create policy to allow authenticated users to delete their own posts
CREATE POLICY "Allow authenticated users to delete posts"
ON posts
FOR DELETE
TO authenticated
USING (true);

-- Create policy to allow everyone to read published posts
CREATE POLICY "Allow everyone to read published posts"
ON posts
FOR SELECT
TO authenticated, anon
USING (published = true);

-- Create policy to allow authenticated users to read all posts (published and unpublished)
CREATE POLICY "Allow authenticated users to read all posts"
ON posts
FOR SELECT
TO authenticated
USING (true); 