// Script to test file uploads to Supabase storage
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const testUserId = process.env.TEST_USER_ID || 'test-user-id'; // Set this in .env or override here
const testImagePath = process.env.TEST_IMAGE_PATH || path.join(__dirname, 'test-image.png'); // Path to a test image

// Create a small test image if it doesn't exist
function createTestImage() {
  if (fs.existsSync(testImagePath)) {
    console.log(`Using existing test image at ${testImagePath}`);
    return;
  }

  console.log(`Creating test image at ${testImagePath}`);
  
  // Create a simple 1x1 PNG (minimal valid PNG)
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00, 
    0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00, 
    0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB0, 0x00, 0x00, 0x00, 
    0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);
  
  fs.writeFileSync(testImagePath, pngHeader);
}

// Main function
async function testFileUpload() {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase URL or service key. Check your .env file.');
    }
    
    // Create test image
    createTestImage();
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Read the test image
    const fileBuffer = fs.readFileSync(testImagePath);
    
    console.log(`Testing upload for user ID: ${testUserId}`);
    
    // Try upload using admin rights (service role)
    const filePath = `${testUserId}/${testUserId}-${Date.now()}.png`;
    
    console.log(`Uploading to path: ${filePath}`);
    
    const { data, error } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });
    
    if (error) {
      throw error;
    }
    
    console.log('Upload successful:', data);
    
    // Get the public URL
    const { data: urlData } = await supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath);
    
    console.log('Public URL:', urlData.publicUrl);
    
    // Try to access the file to verify it's publicly accessible
    console.log('Attempting to verify public access...');
    
    const response = await fetch(urlData.publicUrl);
    
    if (response.ok) {
      console.log('✅ File is publicly accessible');
    } else {
      console.log(`❌ File is not publicly accessible: ${response.status} ${response.statusText}`);
    }
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Error during test:', error.message);
  }
}

testFileUpload(); 