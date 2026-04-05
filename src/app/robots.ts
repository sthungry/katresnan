import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/checkout', '/admin/'],
      },
    ],
    sitemap: 'https://katresnan.id/sitemap.xml',
    host: 'https://katresnan.id',
  }
}
