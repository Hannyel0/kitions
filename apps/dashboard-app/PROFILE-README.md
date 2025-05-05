# Profile Management Feature

This document provides information about the user profile management feature in the dashboard app.

## Overview

The profile management feature allows users (both retailers and distributors) to:

1. View their current profile information
2. Update their first name and last name
3. Update their phone number
4. Upload and update their profile picture

## Setup

Before using the profile feature, you need to set up the Supabase storage bucket for profile pictures:

1. Create a `.env.local` file in the root of the dashboard-app directory if it doesn't already exist
2. Add your Supabase service role key to the `.env.local` file:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
3. Run the setup script to create the storage bucket:
   ```
   npm run create-storage
   ```
4. **Important**: You need to manually set up storage policies in the Supabase dashboard:
   - Go to your Supabase project dashboard
   - Navigate to Storage > Policies
   - For the 'profile-pictures' bucket, add the following policies:

   ### Public Read Policy
   - Policy name: `Public Read Access`
   - Allowed operations: `SELECT`
   - FOR role: `anon, authenticated`
   - USING expression: `bucket_id = 'profile-pictures'`

   ### User Upload Policy
   - Policy name: `User Upload Access`
   - Allowed operations: `INSERT`
   - FOR role: `authenticated`
   - USING expression: `bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]`

   ### User Update/Delete Policy
   - Policy name: `User Update Delete Access`
   - Allowed operations: `UPDATE, DELETE`
   - FOR role: `authenticated`
   - USING expression: `bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]`

5. Your file structure in the bucket should be organized as follows:
   ```
   profile-pictures/
   ├── {user_id}/
   │   ├── {user_id}-{timestamp}.jpg
   │   ├── {user_id}-{timestamp}.png
   │   └── ...
   ```

Note: The service role key is different from your anon key and has admin privileges. You can find it in your Supabase dashboard under Project Settings > API.

## Implementation Details

### Profile Pages

- Retailer profile: `/retailer/profile`
- Distributor profile: `/distributor/profile`

### Database Tables

The feature uses the following tables in the Supabase database:

- `users`: Stores basic user information including profile picture URL
- `auth.users`: The Supabase Auth user table with user metadata

### Storage

Profile pictures are stored in a Supabase storage bucket named `profile-pictures` with the following configuration:

- Public access for reading files
- 1MB file size limit per upload
- File naming convention: `{user_id}-{timestamp}.{extension}`

## Usage

1. Navigate to the profile page using the sidebar navigation menu ("My Profile" link)
2. Update any of the fields in the form
3. Upload a new profile picture using the file input
4. Click "Update Profile" to save your changes

## Technical Implementation

- The profile form uses React state to manage form inputs
- Image uploads are processed using the Supabase Storage JavaScript client
- User data is updated in both the `auth.users` metadata and the custom `users` table
- Real-time feedback is provided using success/error messages

## Troubleshooting

If you encounter issues with profile picture uploads, ensure:

1. The storage bucket exists (run `npm run create-storage` if needed)
2. The public read policy is correctly set up 
3. The user has permission to upload to the storage bucket

For other issues, check the browser console for detailed error messages. 