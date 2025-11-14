'use client';

import { ExternalLink, Star, Zap, Brain } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function SponsorSection() {
  const ads = [
    {
      id: 1,
      title: "AI & Machine Learning Mastery",
      description: "Master cutting-edge AI technologies with our comprehensive course. From neural networks to LLMs.",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      cta: "Start Learning",
      badge: "Featured",
      link: "#"
    },
    {
      id: 2,
      title: "Premium Developer Tools",
      description: "Boost your productivity with AI-powered coding assistants and advanced development environments.",
      image: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      cta: "Try Free",
      badge: "New",
      link: "#"
    }
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Sponsored</h3>
        <div className="w-8 sm:w-12 h-0.5 bg-primary mx-auto"></div>
      </div>

      {/* Responsive grid: 2 columns on small screens, 1 column on large screens (sidebar) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
        {ads.map((ad) => (
          <Card
            key={ad.id}
            className="overflow-hidden transition-shadow duration-300 border-border/50 hover:shadow-lg"
          >
            <div className="relative">
              <img
                src={ad.image}
                alt=""
                className="w-full h-24 sm:h-32 object-cover"
                loading="lazy"
                width="400"
                height="200"
              />
              <div className="absolute top-2 left-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                  {ad.badge === "Featured" && <Star size={10} />}
                  {ad.badge === "New" && <Zap size={10} />}
                  {ad.badge === "Popular" && <Brain size={10} />}
                  {ad.badge}
                </span>
              </div>
            </div>
            <CardContent className="p-3 sm:p-4">
              <h4 className="font-semibold text-foreground mb-2 line-clamp-2 text-sm sm:text-base">
                {ad.title}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-3">
                {ad.description}
              </p>
              <Button
                size="sm"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm"
                asChild
              >
                <a 
                  href={ad.link} 
                  target="_blank" 
                  rel="noopener noreferrer sponsored"
                  aria-label={`${ad.cta} - ${ad.title}`}
                >
                  {ad.cta}
                  <ExternalLink size={12} className="ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}

        <Card className="bg-muted/30 border-dashed border-2 border-muted-foreground/20 flex items-center justify-center text-center">
          <CardContent className="p-4 sm:p-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain size={18} className="text-muted-foreground" />
            </div>
            <h4 className="font-medium text-foreground mb-2 text-sm sm:text-base">Advertise Here</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">
              Reach our engaged community of AI enthusiasts and tech professionals.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs sm:text-sm"
              aria-label="Contact us to advertise on AI Lodi"
            >
              Contact Us
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}