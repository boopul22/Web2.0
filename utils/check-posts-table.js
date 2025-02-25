// Utility script to check if the posts table exists and has the correct structure
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('Error: Supabase URL, Anon Key, or Service Role Key is missing in environment variables');
  process.exit(1);
}

// Create Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkPostsTable() {
  try {
    console.log('Checking posts table in Supabase...');

    // Try to query the posts table directly
    const { data, error } = await supabase
      .from('posts')
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ Error accessing posts table:', error.message);
      console.log('\nPossible issues:');
      console.log('1. The posts table might not exist');
      console.log('2. RLS policies might be preventing access');
      console.log('3. Database permissions issue');
      
      // Check if we need to run migrations
      console.log('\nTo fix this issue:');
      console.log('1. Make sure your Supabase migrations have been applied');
      console.log('2. Check the migration file: supabase/migrations/20250227000000_create_posts_table.sql');
      console.log('3. Run the migration manually if needed');
      return;
    }

    console.log('✅ The posts table exists and is accessible');

    // Try to insert a test post
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
      console.log('\nPossible issues:');
      console.log('1. RLS policies might be preventing insertion');
      console.log('2. Table structure might not match expected schema');
      console.log('3. Database permissions issue');
    } else {
      console.log('✅ Successfully created test post');
      console.log('Test post ID:', insertData[0].id);
      
      // Clean up the test post
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', insertData[0].id);
        
      if (deleteError) {
        console.error('Error deleting test post:', deleteError.message);
      } else {
        console.log('✅ Successfully deleted test post');
      }
    }

    // Test querying posts
    console.log('\nTesting post retrieval...');
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .limit(5);
      
    if (postsError) {
      console.error('❌ Error retrieving posts:', postsError.message);
    } else {
      console.log(`✅ Successfully retrieved ${postsData.length} posts`);
      if (postsData.length > 0) {
        console.log('Sample post:', {
          id: postsData[0].id,
          title: postsData[0].title,
          slug: postsData[0].slug,
          published: postsData[0].published
        });
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

checkPostsTable(); 