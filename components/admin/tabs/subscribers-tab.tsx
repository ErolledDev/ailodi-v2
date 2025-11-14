'use client';

import { useEffect, useState } from 'react';
import { Users, Loader2, Download, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Subscriber {
  id: string;
  email: string;
  postSlug?: string;
  subscribedAt?: any;
}

export function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const subscribersRef = collection(db, 'subscribers');
    const q = query(subscribersRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subscribersData: Subscriber[] = [];
      snapshot.forEach((doc) => {
        subscribersData.push({
          id: doc.id,
          ...doc.data(),
        } as Subscriber);
      });
      setSubscribers(subscribersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to unsubscribe this email?')) return;

    setDeleting(id);
    try {
      await deleteDoc(doc(db, 'subscribers', id));
      toast({
        title: 'Success',
        description: 'Subscriber removed',
      });
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove subscriber',
        variant: 'destructive',
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleExportCSV = () => {
    const csv = [
      ['Email', 'Subscribed From Post', 'Subscription Date'],
      ...subscribers.map(s => [
        s.email,
        s.postSlug || 'N/A',
        s.subscribedAt ? s.subscribedAt.toDate().toISOString() : 'N/A',
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: 'Success',
      description: `Exported ${subscribers.length} subscribers`,
    });
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return 'N/A';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Newsletter Subscribers</h2>
          <p className="text-muted-foreground">
            Manage your newsletter subscriber list ({subscribers.length} subscribers)
          </p>
        </div>
        {subscribers.length > 0 && (
          <Button onClick={handleExportCSV} variant="outline" className="gap-2">
            <Download size={18} />
            Export CSV
          </Button>
        )}
      </div>

      {/* Subscribers List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-8 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Loading subscribers...</p>
            </div>
          </Card>
        ) : subscribers.length === 0 ? (
          <Card className="p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No subscribers yet</p>
          </Card>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">
                      Email
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-foreground hidden md:table-cell">
                      Subscribed From
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-foreground hidden lg:table-cell">
                      Date
                    </th>
                    <th className="text-right px-6 py-3 text-sm font-semibold text-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {subscribers.map((subscriber) => (
                    <tr
                      key={subscriber.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        {subscriber.email}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground hidden md:table-cell text-sm">
                        {subscriber.postSlug || 'Direct'}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground hidden lg:table-cell text-sm">
                        {formatDate(subscriber.subscribedAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(subscriber.id)}
                          disabled={deleting === subscriber.id}
                          className="text-destructive hover:text-destructive"
                        >
                          {deleting === subscriber.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
