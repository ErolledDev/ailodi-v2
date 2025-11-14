import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer | AI Lodi - Tech Insights & AI Innovation',
  description: 'Important disclaimers and limitations regarding AI Lodi content and services. Read our terms for educational content, technology information accuracy, and liability limitations.',
  keywords: [
    'disclaimer',
    'AI Lodi disclaimer',
    'tech blog disclaimer',
    'educational content',
    'technology information',
    'liability limitations',
    'content accuracy',
    'AI information',
    'programming disclaimer',
    'tech advice disclaimer'
  ],
  openGraph: {
    title: 'Disclaimer | AI Lodi',
    description: 'Important disclaimers and limitations regarding AI Lodi content and services.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/disclaimer`,
  },
  twitter: {
    card: 'summary',
    title: 'Disclaimer | AI Lodi',
    description: 'Important disclaimers and limitations regarding AI Lodi content and services.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/disclaimer`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-foreground mb-8">Disclaimer</h1>
        
        <p className="text-muted-foreground mb-6">
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">General Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              The information on AI Lodi is provided on an "as is" basis. To the fullest 
              extent permitted by law, AI Lodi excludes all representations, warranties, 
              obligations, and liabilities arising out of or in connection with the information 
              provided on this website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Educational Purpose</h2>
            <p className="text-muted-foreground leading-relaxed">
              The content on AI Lodi is for educational and informational purposes only. 
              It should not be considered as professional advice for your specific situation. 
              Always consult with qualified professionals before making decisions based on the 
              information provided here.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">No Professional Advice</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The content on AI Lodi does not constitute professional advice in any field, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Technical consulting or implementation guidance</li>
              <li>Investment or financial advice</li>
              <li>Legal advice or regulatory compliance</li>
              <li>Medical or health-related advice</li>
              <li>Business strategy or operational decisions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Technology Information Accuracy</h2>
            <p className="text-muted-foreground leading-relaxed">
              While we strive to provide accurate and up-to-date information about AI, technology trends, 
              and programming concepts, we make no representations or warranties of any kind, express or 
              implied, about the completeness, accuracy, reliability, suitability, or availability of the 
              information, products, services, or related graphics contained on the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">External Links and References</h2>
            <p className="text-muted-foreground leading-relaxed">
              AI Lodi may contain links to external websites, research papers, tools, and services 
              that are not provided or maintained by us. We do not guarantee the accuracy, relevance, 
              timeliness, or completeness of any information on these external resources. The inclusion 
              of any links does not necessarily imply a recommendation or endorse the views expressed within them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Limitations</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall AI Lodi or its contributors be liable for any damages 
              (including, without limitation, damages for loss of data or profit, or due to 
              business interruption) arising out of the use or inability to use the materials 
              on AI Lodi's website, even if AI Lodi or an AI Lodi authorized representative 
              has been notified orally or in writing of the possibility of such damage. Because 
              some jurisdictions do not allow limitations on implied warranties, or limitations 
              of liability for consequential or incidental damages, these limitations may not apply to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Accuracy of Materials</h2>
            <p className="text-muted-foreground leading-relaxed">
              The materials appearing on AI Lodi's website could include technical, 
              typographical, or factual errors. AI Lodi does not warrant that any of the 
              materials on its website are accurate, complete, or current. AI Lodi may make 
              changes to the materials contained on its website at any time without notice. 
              However, AI Lodi does not make any commitment to update the materials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Links and External Resources</h2>
            <p className="text-muted-foreground leading-relaxed">
              AI Lodi has not reviewed all of the sites linked to our website and 
              is not responsible for the contents of any such linked site. The inclusion of 
              any link does not imply endorsement by AI Lodi of the site. Use of 
              any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">User Content and Contributions</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              By submitting content to our website, including comments, feedback, or contributions, you grant us a non-exclusive, royalty-free, 
              perpetual, and worldwide license to use, modify, and display such content. You represent that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>You own or have the necessary rights to the content</li>
              <li>The content does not violate any third-party rights</li>
              <li>The content is not defamatory, obscene, or otherwise objectionable</li>
              <li>The content does not contain viruses or malicious code</li>
              <li>Any code or technical content shared is properly attributed and legally shareable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Prohibited Uses</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You may not use our website:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
              <li>To scrape or harvest content for commercial purposes without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">AI and Technology Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              AI Lodi provides educational content about artificial intelligence, programming, 
              and technology trends. This content is for informational purposes only and should 
              not be considered as professional advice for implementation, investment, or business 
              decisions. Users should conduct their own research and consult with qualified 
              professionals before making decisions based on our content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Code and Technical Examples</h2>
            <p className="text-muted-foreground leading-relaxed">
              Any code examples, tutorials, or technical implementations provided on AI Lodi 
              are for educational purposes only. While we strive for accuracy, we do not guarantee 
              that code examples are error-free or suitable for production use. Users should 
              thoroughly test and validate any code before implementation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Modifications</h2>
            <p className="text-muted-foreground leading-relaxed">
              AI Lodi may revise these terms of service for its website at any time 
              without notice. By using this website, you are agreeing to be bound by the then 
              current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These terms and conditions are governed by and construed in accordance with applicable 
              laws and you irrevocably submit to the exclusive jurisdiction of the courts in 
              that state or location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">
                Email: <a href="mailto:legal@ailodi.tech" className="text-primary hover:text-primary/80">legal@ailodi.tech</a><br />
                Subject: Terms of Service Inquiry
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}