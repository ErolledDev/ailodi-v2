import { Brain, Target, Award, Globe, Zap, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About AI Lodi - Your Global Tech Insights Hub',
  description: 'Learn about AI Lodi\'s mission, core values, and what we cover in AI breakthroughs, programming trends, and future science. Discover our commitment to providing insightful, accessible, and authoritative tech content.',
  keywords: [
    'about us', 
    'AI Lodi mission', 
    'tech blog values', 
    'AI insights', 
    'programming trends', 
    'future science',
    'technology blog',
    'AI innovation',
    'tech community',
    'global tech insights'
  ],
  openGraph: {
    title: 'About AI Lodi - Your Global Tech Insights Hub',
    description: 'Learn about AI Lodi\'s mission to be the ultimate guide in modern technology, providing in-depth analysis and forward-looking insights.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About AI Lodi - Your Global Tech Insights Hub',
    description: 'Learn about AI Lodi\'s mission to be the ultimate guide in modern technology, providing in-depth analysis and forward-looking insights.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/about`,
  },
};

export default function AboutPage() {
  const values = [
    {
      icon: Brain,
      title: 'Insightful',
      description: 'Going beyond headlines to explain why tech trends matter and their broader implications for society and industry.'
    },
    {
      icon: Users,
      title: 'Accessible',
      description: 'Breaking down complex technical concepts into understandable language for developers, enthusiasts, and curious minds alike.'
    },
    {
      icon: Globe,
      title: 'Relevant',
      description: 'Focusing on global trends, significant breakthroughs, and practical applications that impact industries and daily life worldwide.'
    },
    {
      icon: Award,
      title: 'Authoritative',
      description: 'Built on thorough research, expert opinions, and reliable sources from leading tech institutions and innovators.'
    },
  ];

  const contentPillars = [
    {
      icon: Brain,
      title: 'AI Breakthroughs & Global Applications',
      description: 'Generative AI, machine learning, ethical AI, and real-world applications transforming industries.'
    },
    {
      icon: Zap,
      title: 'Programming & Development',
      description: 'Emerging paradigms, developer tools, DevOps trends, and cloud computing innovations.'
    },
    {
      icon: Target,
      title: 'Automation & Future of Work',
      description: 'Hyperautomation strategies, robotics, workforce transformation, and AI-powered systems.'
    },
    {
      icon: Globe,
      title: 'Future Science & Deep Tech',
      description: 'Quantum computing, biotechnology, neuroscience, space exploration, and sustainable tech solutions.'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <Brain size={20} className="text-primary" />
            <span className="text-sm font-medium text-primary">About AI Lodi</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Your Global Tech Insights Hub</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          AI Lodi is the ultimate guide and idol in the dynamic realm of modern technology, 
          illuminating the most impactful and trending topics shaping our world with truly global perspectives on innovation.
        </p>
      </div>

      {/* Mission Section */}
      <div className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                To be the ultimate guide in the dynamic realm of modern technology, providing in-depth analysis, 
                timely news, and forward-looking insights into cutting-edge innovations that shape our world.
              </p>
              <p>
                We serve tech professionals, AI enthusiasts, business leaders, students, researchers, and 
                anyone passionate about staying informed on the bleeding edge of technology and its societal impact.
              </p>
              <p>
                From generative AI breakthroughs to quantum computing advances, from programming paradigms 
                to sustainable tech solutions, we cover the technologies that matter most.
              </p>
            </div>
          </div>
          <div className="lg:pl-8">
            <div className="bg-primary/10 rounded-xl p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">500+</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">Tech Insights Published</p>
                    <p className="text-muted-foreground">In-depth analysis and tutorials</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/80 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">100K+</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">Global Readers</p>
                    <p className="text-muted-foreground">Tech professionals and enthusiasts</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/60 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">24/7</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">Tech Monitoring</p>
                    <p className="text-muted-foreground">Latest breakthroughs and trends</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The principles that guide our content creation and shape how we deliver technology insights.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="text-center hover-lift bg-card shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Content Pillars Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">What We Cover</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our content spans the most impactful areas of modern technology and innovation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {contentPillars.map((pillar, index) => (
            <Card key={index} className="hover-lift bg-card shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <pillar.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {pillar.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Vision Section */}
      <div className="bg-primary/10 rounded-2xl p-8 md:p-12 text-center">
        <div className="flex justify-center items-center gap-3 mb-6">
          <Brain size={24} className="text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Our Vision</h2>
        </div>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          To democratize access to cutting-edge technology insights and create a global community 
          where developers, innovators, and tech enthusiasts can learn, grow, and shape the future 
          of technology together. We believe that knowledge should be accessible, practical, and inspiring.
        </p>
      </div>
    </div>
  );
}