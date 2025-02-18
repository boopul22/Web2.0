-- Add views column
ALTER TABLE blogs ADD COLUMN views INTEGER DEFAULT 0;

-- Create an index on views for faster sorting
CREATE INDEX blogs_views_idx ON blogs(views DESC);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for all users" ON "public"."blogs"
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."blogs"
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON "public"."blogs"
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON "public"."blogs"
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create a function to increment views
CREATE OR REPLACE FUNCTION increment_blog_views(blog_slug TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE blogs
  SET views = views + 1
  WHERE slug = blog_slug;
END;
$$; 