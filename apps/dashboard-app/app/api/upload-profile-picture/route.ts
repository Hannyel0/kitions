import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API: Starting profile picture upload...');
    console.log('Upload API: Request headers:', Object.fromEntries(request.headers.entries()));
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    console.log('Upload API: Received data:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      userId: userId,
      formDataKeys: Array.from(formData.keys())
    });

    if (!file) {
      console.error('Upload API: No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!userId) {
      console.error('Upload API: No user ID provided');
      return NextResponse.json({ error: 'No user ID provided' }, { status: 400 })
    }

    // Validate file size and type
    if (file.size > 5 * 1024 * 1024) {
      console.error('Upload API: File too large:', file.size);
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      console.error('Upload API: Invalid file type:', file.type);
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Initialize Supabase client using the same method as the existing codebase
    console.log('Upload API: Initializing Supabase client...');
    console.log('Upload API: Environment check:', {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...'
    });
    
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
    console.log('Upload API: Verifying user authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Upload API: Auth error:', authError);
      return NextResponse.json({ error: 'Authentication error' }, { status: 401 })
    }
    
    if (!user) {
      console.error('Upload API: No user found');
      return NextResponse.json({ error: 'No user found' }, { status: 401 })
    }
    
    if (user.id !== userId) {
      console.error('Upload API: User ID mismatch:', { authUserId: user.id, providedUserId: userId });
      return NextResponse.json({ error: 'User ID mismatch' }, { status: 401 })
    }

    console.log('Upload API: User authenticated successfully:', user.id);

    // Generate unique filename
    const fileExtension = file.type.split('/')[1] || 'jpg'
    const fileName = `${userId}-${Date.now()}.${fileExtension}`
    const filePath = `profile-pictures/${fileName}`

    console.log('Upload API: Generated file path:', filePath);

    // Convert file to buffer
    const buffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(buffer)

    console.log('Upload API: File buffer created, size:', fileBuffer.length);

    // Check if bucket exists and is accessible
    console.log('Upload API: Checking bucket access...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      console.error('Upload API: Error listing buckets:', bucketError);
    } else {
      console.log('Upload API: Available buckets:', buckets.map(b => b.name));
      const profilePicturesBucket = buckets.find(b => b.name === 'profile-pictures');
      if (profilePicturesBucket) {
        console.log('Upload API: profile-pictures bucket found:', profilePicturesBucket);
      } else {
        console.warn('Upload API: profile-pictures bucket not found!');
      }
    }

    // Upload to Supabase Storage
    console.log('Upload API: Uploading to Supabase Storage...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.error('Upload API: Supabase storage upload error:', {
        error: uploadError,
        message: uploadError.message,
        details: uploadError
      })
      return NextResponse.json({ 
        error: `Storage upload failed: ${uploadError.message}`,
        details: uploadError
      }, { status: 500 })
    }

    console.log('Upload API: File uploaded successfully:', uploadData);

    // Get public URL
    console.log('Upload API: Getting public URL...');
    const { data: urlData } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl
    console.log('Upload API: Generated public URL:', publicUrl);

    // Update user profile in database - checking both possible table names
    console.log('Upload API: Updating user profile in database...');
    const { error: updateError } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        profile_picture_url: publicUrl,
        updated_at: new Date().toISOString()
      })

    if (updateError) {
      console.log('Upload API: user_profiles table failed, trying users table...', {
        error: updateError,
        message: updateError.message,
        details: updateError
      });
      // Try the users table if user_profiles doesn't exist
      const { error: usersUpdateError } = await supabase
        .from('users')
        .update({
          profile_picture_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (usersUpdateError) {
        console.error('Upload API: Database update failed for both tables:', { 
          userProfilesError: updateError, 
          usersError: usersUpdateError,
          userProfilesMessage: updateError.message,
          usersMessage: usersUpdateError.message
        })
        return NextResponse.json({ 
          error: 'Failed to update profile in database',
          details: {
            userProfilesError: updateError.message,
            usersError: usersUpdateError.message
          }
        }, { status: 500 })
      }
      
      console.log('Upload API: Successfully updated users table');
    } else {
      console.log('Upload API: Successfully updated user_profiles table');
    }

    console.log('Upload API: Profile picture upload completed successfully');
    
    return NextResponse.json({
      success: true,
      url: publicUrl,
      message: 'Profile picture updated successfully'
    })

  } catch (error) {
    console.error('Upload API: Unexpected error:', error)
    return NextResponse.json({ 
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
} 