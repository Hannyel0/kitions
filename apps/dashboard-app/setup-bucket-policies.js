// Script to set up proper bucket policies for profile pictures
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

async function setupBucketPolicies() {
  try {
    // First, list the buckets to make sure the profile-pictures bucket exists
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      throw bucketError;
    }
    
    const profileBucket = buckets.find(bucket => bucket.name === 'profile-pictures');
    
    if (!profileBucket) {
      console.log('Profile pictures bucket not found. Creating it first...');
      
      // Create the bucket if it doesn't exist
      const { data, error } = await supabase.storage.createBucket('profile-pictures', {
        public: true, // Allow public access to the bucket
        fileSizeLimit: 1024 * 1024, // 1MB limit per file
      });
      
      if (error) throw error;
      console.log('Successfully created profile-pictures bucket:', data);
    } else {
      console.log('Profile pictures bucket exists:', profileBucket);
    }
    
    // Get existing policies to avoid duplicates
    const { data: policies, error: policiesError } = await supabase.rpc('get_policies', {
      table_name: 'objects',
      schema_name: 'storage'
    });
    
    if (policiesError) {
      console.warn('Could not check existing policies, will attempt to create anyway:', policiesError);
    } else {
      console.log('Existing policies:', policies);
    }
    
    // Set up RLS policies for the storage bucket using SQL queries
    // Since the JS API for policies might not be fully compatible, we'll use SQL directly
    
    // Allow public read access to the profile-pictures bucket
    const { error: readPolicyError } = await supabase.rpc('create_storage_policy', {
      name: 'Public Read Policy',
      bucket_id: 'profile-pictures',
      definition: "bucket_id = 'profile-pictures'", 
      actions: 'SELECT',
      role_name: 'anon'
    });
    
    if (readPolicyError) {
      console.warn('Could not create read policy:', readPolicyError);
    } else {
      console.log('Successfully created public read policy');
    }
    
    // Allow authenticated users to upload only to their own folder
    const { error: insertPolicyError } = await supabase.rpc('create_storage_policy', {
      name: 'User Upload Policy',
      bucket_id: 'profile-pictures',
      definition: "bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]", 
      actions: 'INSERT',
      role_name: 'authenticated'
    });
    
    if (insertPolicyError) {
      console.warn('Could not create insert policy:', insertPolicyError);
    } else {
      console.log('Successfully created user upload policy');
    }
    
    // Allow authenticated users to update/delete only their own files
    const { error: updatePolicyError } = await supabase.rpc('create_storage_policy', {
      name: 'User Update Delete Policy',
      bucket_id: 'profile-pictures',
      definition: "bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]", 
      actions: 'UPDATE,DELETE',
      role_name: 'authenticated'
    });
    
    if (updatePolicyError) {
      console.warn('Could not create update/delete policy:', updatePolicyError);
    } else {
      console.log('Successfully created user update/delete policy');
    }
    
    console.log('Storage bucket policies setup completed!');
  } catch (error) {
    console.error('Error setting up bucket policies:', error.message);
  }
}

setupBucketPolicies(); 