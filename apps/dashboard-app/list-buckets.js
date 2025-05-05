// Script to list Supabase storage buckets
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables. Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file');
  process.exit(1);
}

// Create a Supabase client with the service role key for admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listBuckets() {
  try {
    // List all buckets
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      throw error;
    }

    console.log('Storage buckets:');
    data.forEach(bucket => {
      console.log(`- ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });
  } catch (error) {
    console.error('Error listing buckets:', error.message);
  }
}

listBuckets(); 