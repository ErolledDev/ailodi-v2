'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Edit, Trash2, ExternalLink, Plus, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { fetchPostsFromGitHub, deletePostOnGitHub } from '@/lib/github';

interface Post {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image?: string;
}

export function ContentTab() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await fetchPostsFromGitHub();
        setPosts(fetchedPosts.map(p => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          date: p.date,
          excerpt: p.excerpt,
          image: p.image,
        })));
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch posts',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [toast]);

  const handleDeletePost = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setDeleting(slug);
    try {
      await deletePostOnGitHub(slug);
      setPosts(posts.filter(p => p.slug !== slug));
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      });
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Blog Posts</h2>
          <p className="text-muted-foreground">
            Create, edit, and manage your blog posts
          </p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link href="/admin/create">
            <Plus size={18} />
            New Post
          </Link>
        </Button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-8 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          </Card>
        ) : posts.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No posts yet. Create your first post!</p>
            <Button asChild>
              <Link href="/admin/create">Create First Post</Link>
            </Button>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground truncate">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDate(post.date)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    title="View published post"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <ExternalLink size={16} />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    title="Edit post"
                  >
                    <Link href={`/admin/edit/${post.slug}`}>
                      <Edit size={16} />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePost(post.slug)}
                    disabled={deleting === post.slug}
                    className="text-destructive hover:text-destructive"
                    title="Delete post"
                  >
                    {deleting === post.slug ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
