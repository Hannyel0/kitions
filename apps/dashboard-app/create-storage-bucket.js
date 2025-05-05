// Script to create a Supabase storage bucket for profile pictures
// Run with: node create-storage-bucket.js
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

async function createBucket() {
  try {
    // Create the bucket if it doesn't exist
    const { data, error } = await supabase.storage.createBucket('profile-pictures', {
      public: true, // Allow public access to the bucket
      fileSizeLimit: 1024 * 1024, // 1MB limit per file
    });

    if (error) {
      throw error;
    }

    console.log('Successfully created profile-pictures bucket:', data);

    // Set up bucket policies to allow public access to read files
    const { error: policyError } = await supabase.storage.from('profile-pictures').createPolicy('public-read', {
      name: 'Public Read Policy',
      type: 'read', // read-only policy
      definition: {
        // Everyone can read files
        role: 'anon',
      },
    });

    if (policyError) {
      throw policyError;
    }

    console.log('Successfully set up storage policies');
  } catch (error) {
    console.error('Error creating bucket:', error.message);
  }
}

createBucket(); 