import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | AI Lodi - Tech Insights & AI Innovation',
  description: 'AI Lodi privacy policy explains how we collect, use, and protect your personal information. Learn about our data practices, cookies, security measures, and your privacy rights.',
  keywords: [
    'privacy policy',
    'AI Lodi privacy',
    'data protection',
    'personal information',
    'cookies policy',
    'data security',
    'privacy rights',
    'GDPR compliance',
    'data collection',
    'user privacy'
  ],
  openGraph: {
    title: 'Privacy Policy | AI Lodi',
    description: 'Learn how AI Lodi collects, uses, and protects your personal information in our comprehensive privacy policy.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/privacy-policy`,
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | AI Lodi',
    description: 'Learn how AI Lodi collects, uses, and protects your personal information.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/privacy-policy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <p className="text-muted-foreground mb-6">
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              This Privacy Policy describes how AI Lodi ("we," "our," or "us") collects, 
              uses, and shares your personal information when you visit or use our website 
              and services focused on AI, technology insights, and programming content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-foreground mb-2">Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Contact information when you reach out to us or subscribe to our newsletter</li>
                  <li>Comments, feedback, and contributions you submit</li>
                  <li>Account information if you create a user profile</li>
                  <li>Professional information you choose to share (e.g., developer background, interests)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-foreground mb-2">Automatically Collected Information</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Browser type, version, and operating system</li>
                  <li>IP address and general location information</li>
                  <li>Pages visited, time spent on our site, and reading patterns</li>
                  <li>Referring website and search terms used to find us</li>
                  <li>Device information and screen resolution</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>To provide and improve our AI and technology content and services</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To send you newsletters and updates about AI trends and tech insights (with your consent)</li>
              <li>To analyze website usage and improve user experience</li>
              <li>To personalize content recommendations based on your interests</li>
              <li>To comply with legal obligations and protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties, 
              except in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>With your explicit consent</li>
              <li>To comply with legal requirements or court orders</li>
              <li>To protect our rights, safety, and the safety of others</li>
              <li>With trusted service providers who assist in operating our website (under strict confidentiality agreements)</li>
              <li>In connection with a business transfer or merger (with notice to affected users)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to enhance your browsing experience, 
              analyze site traffic, and understand where our visitors are coming from. This helps us 
              provide better content about AI, programming, and technology trends. You can control 
              cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. This includes encryption, 
              secure servers, and regular security assessments. However, no method of transmission 
              over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Access to your personal information and how it's used</li>
              <li>Correction of inaccurate or incomplete information</li>
              <li>Deletion of your personal information (subject to legal requirements)</li>
              <li>Restriction of processing in certain circumstances</li>
              <li>Data portability for information you've provided</li>
              <li>Objection to processing for direct marketing purposes</li>
              <li>Withdrawal of consent where processing is based on consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Services and Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website may contain links to third-party websites, tools, research papers, or services 
              related to AI and technology. We are not responsible for the privacy practices of these 
              external sites. We encourage you to review their privacy policies when visiting external links.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website is not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13. If you believe we have collected 
              information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">International Data Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              As a global platform covering international AI and technology trends, your information 
              may be transferred to and processed in countries other than your own. We ensure 
              appropriate safeguards are in place to protect your information in accordance with 
              applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices 
              or applicable laws. We will notify you of any material changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">
                Email: <a href="mailto:privacy@ailodi.tech" className="text-primary hover:text-primary/80">privacy@ailodi.tech</a><br />
                Subject: Privacy Policy Inquiry
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}