import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function DELETE(request: NextRequest) {
  try {
    console.log('Remove API: Starting profile picture removal...');
    
    const { userId, imageUrl } = await request.json()

    console.log('Remove API: Received data:', {
      userId: userId,
      imageUrl: imageUrl
    });

    if (!userId) {
      console.error('Remove API: No user ID provided');
      return NextResponse.json({ error: 'No user ID provided' }, { status: 400 })
    }

    if (!imageUrl) {
      console.error('Remove API: No image URL provided');
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 })
    }

    // Initialize Supabase client
    console.log('Remove API: Initializing Supabase client...');
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    )

    // Verify user authentication
    console.log('Remove API: Verifying user authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user || user.id !== userId) {
      console.error('Remove API: Authentication failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Remove API: User authenticated successfully:', user.id);

    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathSegments = url.pathname.split('/');
    const objectIndex = pathSegments.findIndex(segment => segment === 'object');
    
    if (objectIndex === -1 || !pathSegments[objectIndex + 2]) {
      console.error('Remove API: Invalid image URL format');
      return NextResponse.json({ error: 'Invalid image URL format' }, { status: 400 })
    }

    const bucketName = pathSegments[objectIndex + 1];
    const filePath = pathSegments.slice(objectIndex + 2).join('/');

    console.log('Remove API: Extracted file info:', { bucketName, filePath });

    // Remove file from Supabase Storage
    console.log('Remove API: Removing file from storage...');
    const { error: storageError } = await supabase.storage
      .from(bucketName)
      .remove([filePath])

    if (storageError) {
      console.error('Remove API: Storage removal error:', storageError);
      return NextResponse.json({ 
        error: `Failed to remove from storage: ${storageError.message}` 
      }, { status: 500 })
    }

    console.log('Remove API: File removed from storage successfully');

    // Update user profile in database to remove profile picture URL
    console.log('Remove API: Updating user profile in database...');
    const { error: updateError } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        profile_picture_url: null,
        updated_at: new Date().toISOString()
      })

    if (updateError) {
      console.log('Remove API: user_profiles table failed, trying users table...', updateError);
      // Try the users table if user_profiles doesn't exist
      const { error: usersUpdateError } = await supabase
        .from('users')
        .update({
          profile_picture_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (usersUpdateError) {
        console.error('Remove API: Database update failed for both tables:', { 
          updateError, 
          usersUpdateError
        })
        return NextResponse.json({ 
          error: 'Failed to update profile in database' 
        }, { status: 500 })
      }
      
      console.log('Remove API: Successfully updated users table');
    } else {
      console.log('Remove API: Successfully updated user_profiles table');
    }

    console.log('Remove API: Profile picture removal completed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Profile picture removed successfully'
    })

  } catch (error) {
    console.error('Remove API: Unexpected error:', error)
    return NextResponse.json({ 
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
} 