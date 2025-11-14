import { Zap, Brain, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="medium-hero min-h-[100dvh] flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Brain size={20} className="text-primary" />
              <span className="text-sm font-medium text-primary">AI Innovation Hub</span>
            </div>
          </div>
          
          <h1 className="medium-hero-title">
            Your Global Tech Insights
          </h1>
          
          <p className="medium-hero-subtitle">
            Discover cutting-edge AI breakthroughs, programming trends, and future science. 
            Stay ahead with in-depth analysis and insights that matter.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="medium-btn medium-btn-primary">
              <Link href="#featured">
                <Zap size={18} className="mr-2" />
                Explore Latest Insights
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="medium-btn medium-btn-secondary">
              <Link href="/categories">
                <Code size={18} className="mr-2" />
                Browse Categories
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 flex justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>AI & Machine Learning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Programming & Development</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Future Science</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}