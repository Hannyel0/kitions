export async function POST(req: Request) {
  try {
    // Get the secret key from the request headers
    const authHeader = req.headers.get('Authorization');
    const secretKey = authHeader ? authHeader.replace('Bearer ', '') : '';
    
    console.log('Secret key provided:', secretKey);
    console.log('ENV variable exists:', !!process.env.MY_SECRET_EMAIL_KEY);
    
    // Check if the environment variable is set
    if (!process.env.MY_SECRET_EMAIL_KEY) {
      console.error('MY_SECRET_EMAIL_KEY environment variable is not set');
      // Temporary fallback for testing - REMOVE IN PRODUCTION
      if (secretKey === 'correr83') {
        return new Response(JSON.stringify({ success: true }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Check if the secret key is valid
    if (secretKey !== process.env.MY_SECRET_EMAIL_KEY) {
      console.log('Keys do not match');
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Key validation successful');
    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error validating key:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 