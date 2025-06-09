/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.kitions.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  generateIndexSitemap: true,
  
  // Exclude certain paths from the sitemap
  exclude: [
    '/api/*',
    '/auth/*', 
    '/secret-email-panel',
    '/verification',
    '/verification/*',
    '/reset-password',
    '/forgot-password',
    '/login',
    '/signup',
    '/signup/*',
    '/not-found',
    '/loading'
  ],

  // Transform function to customize URLs and their properties
  transform: async (config, path) => {
    // Additional filtering to exclude paths that might slip through
    const excludePaths = [
      '/api',
      '/auth',
      '/secret-email-panel',
      '/verification',
      '/reset-password',
      '/forgot-password', 
      '/login',
      '/signup'
    ];
    
    // Check if path starts with any exclude pattern
    for (const excludePath of excludePaths) {
      if (path.startsWith(excludePath)) {
        return null; // Exclude this path
      }
    }

    // Set custom priorities and change frequencies for different page types
    let priority = config.priority;
    let changefreq = config.changefreq;

    // Homepage gets highest priority
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    }
    // Main marketing pages get high priority
    else if (['/for-distributors', '/for-retailers', '/about'].includes(path)) {
      priority = 0.9;
      changefreq = 'weekly';
    }
    // Blog pages get medium-high priority
    else if (path.startsWith('/blog')) {
      priority = 0.8;
      changefreq = 'weekly';
    }
    // Product and partnership pages
    else if (path.startsWith('/products') || path.startsWith('/partnership')) {
      priority = 0.7;
      changefreq = 'monthly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },

  // Robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/', 
          '/secret-email-panel',
          '/verification/',
          '/reset-password',
          '/forgot-password',
          '/login',
          '/signup/'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/', 
          '/secret-email-panel',
          '/verification/',
          '/reset-password',
          '/forgot-password',
          '/login',
          '/signup/'
        ],
      }
    ],
    additionalSitemaps: [
      // Add any additional custom sitemaps here if needed
      // 'https://www.kitions.com/server-sitemap.xml',
    ],
  },
}; 