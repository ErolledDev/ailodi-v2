'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, MessageSquare, Users, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { collection, query, where, getDocs, countDocuments } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { fetchPostsFromGitHub } from '@/lib/github';

export function OverviewTab() {
  const [stats, setStats] = useState({
    postsCount: 0,
    commentsCount: 0,
    subscribersCount: 0,
    pendingComments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch posts count from GitHub
        const posts = await fetchPostsFromGitHub();
        
        // Fetch comments count from Firebase
        const commentsRef = collection(db, 'comments');
        const allComments = await getDocs(commentsRef);
        const pendingQuery = query(commentsRef, where('approved', '==', false));
        const pendingComments = await getDocs(pendingQuery);

        // Fetch subscribers count from Firebase
        const subscribersRef = collection(db, 'subscribers');
        const subscribers = await getDocs(subscribersRef);

        setStats({
          postsCount: posts.length,
          commentsCount: allComments.size,
          subscribersCount: subscribers.size,
          pendingComments: pendingComments.size,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.postsCount,
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      action: { label: 'Manage Posts', href: '/admin/dashboard?tab=content' },
    },
    {
      title: 'Comments',
      value: stats.commentsCount,
      subtitle: `${stats.pendingComments} pending`,
      icon: MessageSquare,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
      action: { label: 'Review Comments', href: '/admin/dashboard?tab=comments' },
    },
    {
      title: 'Subscribers',
      value: stats.subscribersCount,
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      action: { label: 'Manage Subscribers', href: '/admin/dashboard?tab=subscribers' },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard. Manage your blog posts, comments, and subscribers here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-muted-foreground text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <div className="flex items-baseline gap-2 mb-4">
                <p className="text-3xl font-bold text-foreground">
                  {loading ? '-' : stat.value}
                </p>
                {stat.subtitle && (
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                asChild
              >
                <Link href={stat.action.href}>
                  {stat.action.label}
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button asChild size="lg" className="justify-start">
            <Link href="/admin/create" className="gap-2">
              <FileText size={18} />
              Create New Post
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="justify-start">
            <a
              href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <FileText size={18} />
              Manage on GitHub
            </a>
          </Button>
        </div>
      </Card>

      {/* Getting Started */}
      <Card className="p-6 border-primary/20 bg-primary/5">
        <h3 className="text-xl font-bold text-foreground mb-2">Getting Started</h3>
        <ul className="space-y-2 text-muted-foreground text-sm">
          <li>✓ Create and publish blog posts</li>
          <li>✓ Moderate and reply to comments</li>
          <li>✓ Manage your newsletter subscribers</li>
          <li>✓ Track blog statistics</li>
          <li>✓ Posts sync with your GitHub repository</li>
        </ul>
      </Card>
    </div>
  );
}
