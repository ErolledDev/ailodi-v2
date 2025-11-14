'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Loader2, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { collection, query, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Comment {
  id: string;
  postSlug: string;
  author: string;
  content: string;
  approved: boolean;
  isAdmin?: boolean;
  createdAt?: any;
}

type FilterType = 'all' | 'pending' | 'approved';

export function CommentsTab() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef);

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
  }, []);

  const filteredComments = comments.filter((comment) => {
    if (filter === 'pending') return !comment.approved;
    if (filter === 'approved') return comment.approved;
    return true;
  });

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, 'comments', id), { approved: true });
      toast({
        title: 'Success',
        description: 'Comment approved',
      });
    } catch (error) {
      console.error('Error approving comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve comment',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    setDeleting(id);
    try {
      await deleteDoc(doc(db, 'comments', id));
      toast({
        title: 'Success',
        description: 'Comment deleted',
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete comment',
        variant: 'destructive',
      });
    } finally {
      setDeleting(null);
    }
  };

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

  const pendingCount = comments.filter(c => !c.approved).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Comments</h2>
        <p className="text-muted-foreground">
          Moderate and manage blog comments {pendingCount > 0 && `(${pendingCount} pending)`}
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All ({comments.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          Pending ({pendingCount})
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'outline'}
          onClick={() => setFilter('approved')}
        >
          Approved ({comments.filter(c => c.approved).length})
        </Button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-8 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Loading comments...</p>
            </div>
          </Card>
        ) : filteredComments.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {filter === 'pending' ? 'No pending comments' : 'No comments yet'}
            </p>
          </Card>
        ) : (
          filteredComments.map((comment) => (
            <Card
              key={comment.id}
              className={`p-4 ${!comment.approved ? 'border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20' : ''}`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{comment.author}</h3>
                    {!comment.approved && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-yellow-200 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-200 text-xs rounded-full font-medium">
                        Pending
                      </span>
                    )}
                    {comment.isAdmin && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-200 text-xs rounded-full font-medium">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Post: <span className="font-medium">{comment.postSlug}</span> • {formatDate(comment.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!comment.approved && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApprove(comment.id)}
                    >
                      Approve
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(comment.id)}
                    disabled={deleting === comment.id}
                    className="text-destructive hover:text-destructive"
                  >
                    {deleting === comment.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </Button>
                </div>
              </div>

              <p className="text-foreground leading-relaxed">{comment.content}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
