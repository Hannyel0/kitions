/**
 * Central URL configuration for the application
 * Use this for all URL references to ensure consistency
 */
export const URLs = {
  /**
   * URLs for the main public-facing application
   */
  public: {
    base: process.env.NEXT_PUBLIC_PUBLIC_APP_URL || 
      (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.kitions.com'),
    login: '/login',
    signup: '/signup',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    home: '/',
    secretEmailPanel: '/secret-email-panel',
  },
  
  /**
   * URLs for the dashboard application
   */
  dashboard: {
    base: process.env.NEXT_PUBLIC_DASHBOARD_APP_URL || 
      (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://dashboard.kitions.com'),
    authCallback: '/auth/callback',
    retailerHome: '/retailer/home',
    distributorHome: '/distributor/home',
    errorAuth: '/error-auth',
  },
  
  /**
   * API endpoints
   */
  api: {
    base: process.env.NEXT_PUBLIC_API_URL || 
      (process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : 'https://www.kitions.com/api'),
    secretEmail: '/api/secret-email',
    secretEmailValidate: '/api/secret-email/validate',
  },
  
  /**
   * Helper method to get full URLs including the base
   */
  getPublicUrl: (path: string) => {
    const base = process.env.NEXT_PUBLIC_PUBLIC_APP_URL || 
      (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.kitions.com');
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  },
  
  getDashboardUrl: (path: string) => {
    const base = process.env.NEXT_PUBLIC_DASHBOARD_APP_URL || 
      (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://dashboard.kitions.com');
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  }
}; 