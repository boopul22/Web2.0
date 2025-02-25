-- First, check if columns exist and add them if they don't
DO $$ 
BEGIN 
    -- Add author_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'posts' 
                  AND column_name = 'author_id') THEN
        ALTER TABLE posts ADD COLUMN author_id UUID NOT NULL REFERENCES auth.users(id);
    END IF;

    -- Add summary column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'posts' 
                  AND column_name = 'summary') THEN
        ALTER TABLE posts ADD COLUMN summary TEXT;
    END IF;

    -- Add content column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'posts' 
                  AND column_name = 'content') THEN
        ALTER TABLE posts ADD COLUMN content TEXT;
    END IF;

    -- Add featured_image column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'posts' 
                  AND column_name = 'featured_image') THEN
        ALTER TABLE posts ADD COLUMN featured_image TEXT;
    END IF;

    -- Add published column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'posts' 
                  AND column_name = 'published') THEN
        ALTER TABLE posts ADD COLUMN published BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'posts' 
                  AND column_name = 'status') THEN
        ALTER TABLE posts ADD COLUMN status TEXT NOT NULL DEFAULT 'draft';
    END IF;

    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'posts' 
                  AND column_name = 'created_at') THEN
        ALTER TABLE posts ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;

    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'posts' 
                  AND column_name = 'updated_at') THEN
        ALTER TABLE posts ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$; 