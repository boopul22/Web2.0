// Utility script to fix the posts table schema in Supabase
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Supabase URL or Service Role Key is missing in environment variables');
  process.exit(1);
}

// Create Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixPostsTable() {
  try {
    console.log('Checking posts table schema...');

    // First, let's check if the table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('posts')
      .select('id')
      .limit(1);

    if (tableError && tableError.message.includes('relation "posts" does not exist')) {
      console.log('❌ Posts table does not exist. Creating it now...');
      
      // Create the posts table
      const { error: createError } = await supabase.rpc('create_posts_table');
      
      if (createError) {
        console.error('Failed to create posts table:', createError.message);
        
        // Try direct SQL approach
        console.log('Attempting to create table with direct SQL...');
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS public.posts (
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
          
          -- Enable RLS
          ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
          
          -- Create policies
          CREATE POLICY "Allow authenticated users to create posts"
          ON public.posts
          FOR INSERT
          TO authenticated
          WITH CHECK (true);
          
          CREATE POLICY "Allow authenticated users to update posts"
          ON public.posts
          FOR UPDATE
          TO authenticated
          USING (true);
          
          CREATE POLICY "Allow authenticated users to delete posts"
          ON public.posts
          FOR DELETE
          TO authenticated
          USING (true);
          
          CREATE POLICY "Allow everyone to read published posts"
          ON public.posts
          FOR SELECT
          TO authenticated, anon
          USING (published = true);
          
          CREATE POLICY "Allow authenticated users to read all posts"
          ON public.posts
          FOR SELECT
          TO authenticated
          USING (true);
        `;
        
        // We can't execute this directly with the JS client
        console.log('Please run the SQL in the Supabase SQL Editor');
        console.log(createTableSQL);
        return;
      }
      
      console.log('✅ Posts table created successfully');
    } else if (tableError) {
      console.error('Error checking table:', tableError.message);
      return;
    } else {
      console.log('✅ Posts table exists');
      
      // Check if the published column exists
      console.log('Checking if published column exists...');
      
      // We can't directly check columns with the JS client, so let's try to update a dummy record
      const testId = '00000000-0000-0000-0000-000000000000'; // A dummy UUID that won't exist
      const { error: updateError } = await supabase
        .from('posts')
        .update({ published: true })
        .eq('id', testId);
      
      if (updateError && updateError.message.includes('published')) {
        console.log('❌ The published column does not exist. Adding it now...');
        
        // We can't alter the table directly with the JS client
        console.log('Please run the following SQL in the Supabase SQL Editor:');
        console.log('ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT FALSE;');
        return;
      } else {
        console.log('✅ The published column exists');
      }
    }
    
    // Test creating a post
    console.log('\nTesting post creation...');
    const testPost = {
      title: 'Test Post',
      slug: 'test-post-' + Date.now(),
      summary: 'This is a test post',
      content: 'Test content',
      published: false
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('posts')
      .insert([testPost])
      .select();
      
    if (insertError) {
      console.error('❌ Error creating test post:', insertError.message);
      
      // Check if it's a schema issue
      if (insertError.message.includes('column') || insertError.message.includes('schema')) {
        console.log('\nThe table schema might not match what the application expects.');
        console.log('Expected schema:');
        console.log('- id: UUID (primary key)');
        console.log('- title: TEXT (not null)');
        console.log('- slug: TEXT (not null, unique)');
        console.log('- summary: TEXT');
        console.log('- content: TEXT');
        console.log('- featured_image: TEXT');
        console.log('- published: BOOLEAN (default false)');
        console.log('- created_at: TIMESTAMPTZ (default now())');
        console.log('- updated_at: TIMESTAMPTZ (default now())');
      }
    } else {
      console.log('✅ Successfully created test post');
      console.log('Test post ID:', insertData[0].id);
      
      // Clean up
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', insertData[0].id);
        
      if (deleteError) {
        console.error('Error deleting test post:', deleteError.message);
      } else {
        console.log('✅ Successfully deleted test post');
      }
      
      console.log('\n✅ The posts table is correctly configured and working!');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

fixPostsTable(); 