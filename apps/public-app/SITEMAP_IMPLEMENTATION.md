# Sitemap Implementation for Kitions Public App

This document describes the implementation of XML sitemaps and robots.txt for the Kitions public website using `next-sitemap`.

## Overview

The sitemap implementation automatically generates:
- **sitemap.xml** - Index sitemap pointing to individual sitemaps
- **sitemap-0.xml** - Main sitemap containing all public pages
- **robots.txt** - Search engine directives and sitemap references

## Configuration

### Package Installation
```bash
npm install next-sitemap
```

### Configuration File: `next-sitemap.config.js`

The configuration is optimized for Kitions' B2B marketplace:

```javascript
module.exports = {
  siteUrl: 'https://kitions.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  generateIndexSitemap: true,
  // ... see full config in next-sitemap.config.js
}
```

### Build Integration

The sitemap generation is integrated into the build process:

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "next-sitemap",
    "sitemap": "next-sitemap"
  }
}
```

## Generated Files

### Main Sitemap Index (`sitemap.xml`)
- References all individual sitemaps
- Located at: `https://kitions.com/sitemap.xml`

### Individual Sitemap (`sitemap-0.xml`)
Contains the following pages with optimized SEO settings:

| Page | Priority | Change Frequency | Description |
|------|----------|------------------|-------------|
| Homepage (/) | 1.0 | Daily | Highest priority - main landing page |
| /for-distributors | 0.9 | Weekly | Key marketing page for distributors |
| /for-retailers | 0.9 | Weekly | Key marketing page for retailers |
| /about | 0.9 | Weekly | Company information |
| /blog | 0.8 | Weekly | Content marketing section |
| /products | 0.7 | Monthly | Product information |
| /partnership | 0.7 | Monthly | Partnership opportunities |

### Robots.txt
- Allows crawling of public pages
- Blocks sensitive areas (auth, admin, APIs)
- References sitemap location

## Excluded Pages

The following pages are excluded from the sitemap for SEO and security reasons:

- **Authentication pages**: `/login`, `/signup/*`, `/auth/*`
- **User management**: `/verification/*`, `/reset-password`, `/forgot-password`
- **Admin areas**: `/secret-email-panel`
- **API endpoints**: `/api/*`
- **Development pages**: `/not-found`, `/loading`

## SEO Benefits

1. **Improved Discovery**: Search engines can easily find all important pages
2. **Crawl Efficiency**: Helps search engines understand site structure
3. **Priority Signals**: Communicates relative importance of pages
4. **Update Frequency**: Informs crawlers how often to check for changes
5. **Security**: Prevents indexing of sensitive areas

## Usage

### Automatic Generation (Production)
```bash
npm run build
# Sitemap is automatically generated after build
```

### Manual Generation (Development)
```bash
npm run sitemap
# Generates sitemap without building the entire app
```

### Verification
- Check generated files in `/public/` directory
- Verify sitemap at: `https://kitions.com/sitemap.xml`
- Test robots.txt at: `https://kitions.com/robots.txt`

## Customization

### Adding New Pages
New pages in the `/app` directory are automatically included unless:
1. They match an exclusion pattern
2. They're filtered out in the `transform` function

### Modifying Priorities
Update the `transform` function in `next-sitemap.config.js`:

```javascript
transform: async (config, path) => {
  if (path === '/new-important-page') {
    return {
      loc: path,
      changefreq: 'daily',
      priority: 0.9,
      lastmod: new Date().toISOString(),
    };
  }
  // ... rest of transform logic
}
```

### Environment Configuration
Set custom site URL via environment variable:
```bash
SITE_URL=https://kitions.com
```

## Monitoring & Maintenance

1. **Google Search Console**: Submit sitemap for indexing monitoring
2. **Regular Updates**: Sitemap regenerates automatically on each build
3. **Validation**: Use online XML sitemap validators to check structure
4. **Analytics**: Monitor search console for crawl errors or issues

## Technical Details

- **Next.js Version**: 15.3.1+
- **Package**: next-sitemap v4.2.3
- **Generation Time**: Automatic during build process
- **File Size**: Optimized for fast parsing
- **Standards Compliance**: Follows XML Sitemap Protocol 0.9

## Future Enhancements

1. **Dynamic Sitemaps**: For blog posts and dynamic content
2. **Image Sitemaps**: For product images and visual content
3. **News Sitemaps**: For time-sensitive content
4. **Multi-language Support**: If internationalization is added

---

For questions or issues related to sitemap implementation, please refer to the [next-sitemap documentation](https://github.com/iamvishnusankar/next-sitemap) or contact the development team. 