import { getAllContent } from '@/lib/content';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz';
  
  try {
    console.log('📡 BUILD: Generating RSS feed with fresh content...');
    
    // Force fresh content fetch for RSS feed generation
    const posts = await getAllContent({ cache: 'no-store' });
    const latestPosts = posts
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, 20); // Latest 20 posts

    console.log(`📡 BUILD: RSS feed generated with ${latestPosts.length} latest posts`);

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title><![CDATA[AI Lodi - Your Global Tech Insights & AI Innovation Hub]]></title>
    <description><![CDATA[AI Lodi is your ultimate guide to modern technology, AI breakthroughs, programming trends, and future science. Get in-depth analysis, tutorials, and insights on cutting-edge tech innovations.]]></description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en-US</language>
    <managingEditor>hello@ailodi.xyz (AI Lodi Team)</managingEditor>
    <webMaster>hello@ailodi.xyz (AI Lodi Team)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <category>Technology</category>
    <category>Artificial Intelligence</category>
    <category>Programming</category>
    <category>Innovation</category>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title><![CDATA[AI Lodi]]></title>
      <link>${baseUrl}</link>
      <width>512</width>
      <height>512</height>
    </image>
    ${latestPosts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.metaDescription}]]></description>
      <content:encoded><![CDATA[${post.content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />')}]]></content:encoded>
      <link>${baseUrl}/post/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/post/${post.slug}</guid>
      <pubDate>${new Date(post.publishDate).toUTCString()}</pubDate>
      <dc:creator><![CDATA[${post.author}]]></dc:creator>
      ${post.categories.map(category => `<category><![CDATA[${category}]]></category>`).join('')}
      ${post.featuredImageUrl ? `<enclosure url="${post.featuredImageUrl}" type="image/jpeg"/>` : ''}
    </item>`).join('')}
  </channel>
</rss>`;

    return new Response(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('❌ BUILD: Error generating RSS feed:', error);
    return new Response('Error generating RSS feed', { status: 500 });
  }
}