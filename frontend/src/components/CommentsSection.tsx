
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Comment } from '@/lib/types';
import useStore from '@/lib/store';

interface CommentsSectionProps {
  complaintId: string;
  comments: Comment[] | undefined;
  isAdminView?: boolean;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

const CommentsSection: React.FC<CommentsSectionProps> = ({ 
  complaintId, 
  comments = [], 
  isAdminView = false 
}) => {
  const { currentUser, addComment } = useStore();
  const [commentText, setCommentText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  
  // Filter comments based on view access
  const visibleComments = isAdminView 
    ? comments 
    : comments.filter(comment => !comment.isInternal);
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    addComment(complaintId, commentText, isInternal);
    setCommentText('');
    setIsInternal(false);
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Comments & Updates</h3>
      
      {visibleComments.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          No comments yet.
        </div>
      ) : (
        <div className="space-y-4">
          {visibleComments.map(comment => (
            <div 
              key={comment.id} 
              className={`p-4 rounded-lg ${
                comment.isInternal 
                  ? 'bg-amber-50 border border-amber-200' 
                  : comment.userRole === 'citizen'
                    ? 'bg-blue-50 border border-blue-100'
                    : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-medium">{comment.userName}</span>
                  <span className="text-xs ml-2 text-gray-500">
                    {comment.userRole === 'agency' ? 'Staff' : comment.userRole}
                  </span>
                  {comment.isInternal && isAdminView && (
                    <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded">
                      Internal Note
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
              </div>
              <p className="text-gray-800">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
      
      {currentUser && (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <Textarea
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Add a comment or update..."
            className="min-h-[100px]"
          />
          
          {isAdminView && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="internal-note" 
                checked={isInternal} 
                onCheckedChange={(checked) => setIsInternal(checked === true)}
              />
              <label 
                htmlFor="internal-note" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Internal note (visible only to staff)
              </label>
            </div>
          )}
          
          <Button type="submit" disabled={!commentText.trim()}>
            Post Comment
          </Button>
        </form>
      )}
    </div>
  );
};

export default CommentsSection;
