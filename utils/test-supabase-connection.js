// Utility script to test Supabase connection
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Supabase URL or Anon Key is missing in environment variables');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Testing Supabase connection...');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // Test authentication service
    console.log('\n1. Testing Auth Service:');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Auth Service Error:', authError.message);
    } else {
      console.log('✅ Auth Service is working');
    }

    // Test database connection
    console.log('\n2. Testing Database Connection:');
    const { data: dbData, error: dbError } = await supabase
      .from('posts')
      .select('id')
      .limit(1);
    
    if (dbError) {
      console.error('❌ Database Error:', dbError.message);
    } else {
      console.log('✅ Database connection successful');
      console.log(`   Posts table has records: ${dbData.length > 0 ? 'Yes' : 'No'}`);
    }

    // Test storage
    console.log('\n3. Testing Storage:');
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    
    if (storageError) {
      console.error('❌ Storage Error:', storageError.message);
    } else {
      console.log('✅ Storage is working');
      console.log('   Available buckets:', buckets.map(b => b.name).join(', ') || 'None');
    }

    console.log('\nSummary:');
    if (authError || dbError || storageError) {
      console.log('❌ Some Supabase services have connection issues. Check the details above.');
    } else {
      console.log('✅ All Supabase services are connected and working properly!');
    }
    
  } catch (error) {
    console.error('Unexpected error during connection test:', error.message);
  }
}

testConnection(); 