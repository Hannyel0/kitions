import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    const { email, firstName, lastName, businessName, role } = body;

    console.log('📧 Invite API called with:', { email, firstName, lastName, businessName, role });

    // Validate required fields
    if (!email || !firstName || !lastName || !businessName || !role) {
      console.error('❌ Missing required fields:', { email: !!email, firstName: !!firstName, lastName: !!lastName, businessName: !!businessName, role: !!role });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format:', email);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('🔑 Environment check:', {
      supabaseUrl: !!supabaseUrl,
      serviceRoleKey: !!serviceRoleKey,
      serviceRoleKeyLength: serviceRoleKey?.length || 0
    });

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('❌ Missing environment variables:', { supabaseUrl: !!supabaseUrl, serviceRoleKey: !!serviceRoleKey });
      return NextResponse.json(
        { error: 'Server configuration error: Missing Supabase credentials' },
        { status: 500 }
      );
    }

    // Create Supabase admin client with service role key
    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('🔧 Supabase admin client created');

    // Determine redirect URL
    const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL 
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/signup/complete-invitation`
      : 'http://localhost:3000/signup/complete-invitation';
    
    console.log('🔗 Redirect URL:', redirectUrl);

    // Use Supabase's admin invite functionality
    console.log('📤 Sending invitation...');
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        first_name: firstName,
        last_name: lastName,
        business_name: businessName,
        role: role,
        invited_by: 'admin'
      },
      redirectTo: redirectUrl
    });

    if (error) {
      console.error('❌ Supabase invite error:', {
        message: error.message,
        status: error.status,
        details: error
      });
      
      // Provide more specific error messages
      let userFriendlyMessage = error.message;
      if (error.message.includes('email')) {
        userFriendlyMessage = 'Error sending invite email. Please check your email configuration in Supabase.';
      } else if (error.message.includes('rate limit')) {
        userFriendlyMessage = 'Too many invitations sent. Please wait before sending another.';
      } else if (error.message.includes('invalid')) {
        userFriendlyMessage = 'Invalid email address or configuration.';
      }
      
      return NextResponse.json(
        { error: userFriendlyMessage },
        { status: 400 }
      );
    }

    console.log('✅ Invitation sent successfully:', { email, userId: data?.user?.id });

    return NextResponse.json({
      success: true,
      message: `Invitation sent successfully to ${email}`,
      data
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('❌ API error:', {
      message: errorMessage,
      stack: errorStack,
      error
    });
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
} 