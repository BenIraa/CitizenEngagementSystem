import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Comment } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { formatDistanceToNow } from 'date-fns';

interface CommentsSectionProps {
  complaintId: string;
  comments: Comment[];
  onAddComment: (message: string) => Promise<void>;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ 
  complaintId, 
  comments,
  onAddComment,
}) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    
    try {
      setIsSubmitting(true);
      await onAddComment(newComment);
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      <h3 className="text-lg font-medium">Comments & Updates</h3>
        <span className="text-sm text-gray-500">
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </span>
        </div>

      {user && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Add a comment or update..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center space-x-2">
                  <span className="font-medium">{comment.userName}</span>
                      {comment.userRole && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {comment.userRole}
                  </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  {comment.isInternal && (
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                      Internal Note
                    </span>
                  )}
                </div>
                <p className="mt-2 text-gray-700 whitespace-pre-line">
                  {comment.content}
                </p>
              </CardContent>
            </Card>
          ))
        )}
            </div>
    </div>
  );
};

export default CommentsSection;
