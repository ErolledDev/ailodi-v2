'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Comment extends DocumentData {
  id: string;
  postSlug: string;
  author: string;
  email?: string;
  content: string;
  approved: boolean;
  isAdmin?: boolean;
  parentId?: string;
  mentionedUser?: string;
  createdAt?: any;
}

interface FirebaseCommentsProps {
  postSlug: string;
  postTitle?: string;
}

export function FirebaseComments({ postSlug, postTitle }: FirebaseCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    content: '',
  });
  const { toast } = useToast();

  // Fetch comments in real-time
  useEffect(() => {
    try {
      const commentsRef = collection(db, 'comments');
      const q = query(
        commentsRef,
        where('postSlug', '==', postSlug),
        where('approved', '==', true),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const commentsData: Comment[] = [];
        snapshot.forEach((doc) => {
          commentsData.push({
            id: doc.id,
            ...doc.data(),
          } as Comment);
        });
        setComments(commentsData);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoading(false);
    }
  }, [postSlug]);

  // Handle comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.author.trim() || !formData.content.trim()) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in your name and comment.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const commentsRef = collection(db, 'comments');
      await addDoc(commentsRef, {
        postSlug,
        author: formData.author.trim(),
        email: formData.email.trim(),
        content: formData.content.trim(),
        approved: false, // Requires admin approval
        isAdmin: false,
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Comment submitted!',
        description: 'Your comment is awaiting moderation and will appear shortly.',
      });

      // Clear form
      setFormData({ author: '', email: '', content: '' });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit comment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Format date
  const formatDate = (timestamp: any): string => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-12 pt-8 border-t border-border">
      {/* Comments Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <MessageSquare size={16} className="text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">Comments</h3>
        </div>
        <p className="text-muted-foreground">
          Join the discussion and share your thoughts about this article. 
          Your feedback helps us create better content for the tech community.
        </p>
      </div>

      {/* Comments List */}
      <div className="space-y-6 mb-8">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
            <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`rounded-lg border ${
                comment.isAdmin ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'
              } p-4`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{comment.author}</span>
                      {comment.isAdmin && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full font-medium">
                          <CheckCircle size={12} />
                          Admin
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {comment.mentionedUser && (
                <p className="text-sm text-muted-foreground mb-2">
                  <span className="text-primary font-medium">@{comment.mentionedUser}</span>
                </p>
              )}

              <p className="text-foreground leading-relaxed">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Comment Form */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Add a Comment</h4>
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Your name"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              disabled={submitting}
              required
            />
            <Input
              type="email"
              placeholder="Your email (optional)"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={submitting}
            />
          </div>

          <Textarea
            placeholder="Share your thoughts..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            disabled={submitting}
            rows={4}
            className="resize-none"
            required
          />

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Comments are moderated and will appear after approval.
            </p>
            <Button
              type="submit"
              disabled={submitting || !formData.author.trim() || !formData.content.trim()}
              className="gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post Comment
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
