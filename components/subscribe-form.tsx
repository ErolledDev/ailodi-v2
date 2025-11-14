'use client';

import { useState } from 'react';
import { Mail, Send, Check, Zap, Brain, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubscribed(true);
        setEmail('');
        
        // Reset success state after 5 seconds
        setTimeout(() => setIsSubscribed(false), 5000);
      } else {
        setError(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3 text-green-700">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check size={20} className="text-green-600" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm sm:text-base">Successfully subscribed!</h3>
              <p className="text-xs sm:text-sm text-green-600">Thank you for joining our AI & tech community.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const errorId = error ? 'subscription-error' : undefined;

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Brain size={20} className="text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg sm:text-xl font-bold text-foreground leading-tight">
              Stay Ahead in AI & Tech
            </CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              Get cutting-edge insights, AI breakthroughs, and programming trends delivered to your inbox
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 border-primary/20 focus:border-primary focus:ring-primary/20 text-sm sm:text-base"
              disabled={isSubmitting}
              aria-describedby={errorId}
              aria-invalid={error ? 'true' : 'false'}
            />
            <Button 
              type="submit" 
              disabled={isSubmitting || !email}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 text-sm sm:text-base"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Zap size={16} className="mr-2" />
                  Subscribe
                </>
              )}
            </Button>
          </div>
          
          {/* Error Message with proper association */}
          {error && (
            <div 
              id={errorId}
              className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span>Weekly AI insights</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span>No spam</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span>Unsubscribe anytime</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}