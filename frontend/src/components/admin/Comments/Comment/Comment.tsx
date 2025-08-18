import React, { useState, useEffect, JSX } from 'react';
import { NavLink, useParams } from "react-router";
import { Comment as CommentType } from '../../../../types';
import { CommentForm } from '../../forms/CommentForm';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '../../utils/formatDataTime';

export function Comment(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [comment, setComment] = useState<CommentType | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveComment = (updatedComment: CommentType) => {
        setComment(updatedComment);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    // Get the comment from the API
    const handleView = async (commentId: string) => {
        const token: string | null = localStorage.getItem("jwt");
        
        try {
            const res = await fetch(`/api/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (res.ok) {
                const data = await res.json();
                setComment(data);
            } else {
                console.error("Error fetching comment:", res.status, res.statusText);
            }
        } catch (err) {
            console.error("Error fetching comment:", err);
        }
    };
    useEffect(() => {
        if (id) {
            handleView(id);
        }
    }, [id]);

    if (!comment) {
        return (
            <div className="p-4">
                <p>Loading comment...</p>
            </div>
        );
    }

    if (isEditing && comment) {
        return (
            <CommentForm 
                commentId={comment.id}
                initialData={comment}
                mode="edit"
                onSave={handleSaveComment} 
                onCancel={handleCancelEdit}
                showArticleInfo={true}
            />
        );
    }

    return (
      <div className="p-4 max-w-2xl mx-auto mt-10">
        {/* Actions */}
        <div className="mb-4 flex justify-end">
          <Button variant="greenDark" onClick={handleEditClick}>Edit Comment</Button>
        </div>

        {/* Structured card like PostDetail, with labeled fields */}
        <div className="bg-white p-6 rounded-md border border-gray-300">
          <h1 className="mb-4 text-2xl font-bold">Comment</h1>

          <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-x-6 gap-y-3 text-sm">
            <div className="text-gray-600">Author:</div>
            <div className="font-medium">{comment.authorName || 'Anonymous'}</div>

            <div className="text-gray-600">Article title:</div>
            <div className="font-medium">
              <NavLink to={`/public/posts/${comment.article.id}`} className="text-beige font-bold">
                {comment.article.title}
              </NavLink>
            </div>

            <div className="text-gray-600">Created:</div>
            <div className="font-medium">{formatDateTime(comment.createdDate)}</div>
          </div>

          <div className="mt-6">
            <div className="text-sm text-gray-600 mb-2">Text:</div>
            <div className="border border-gray-200 rounded-md p-4 bg-gray-50 whitespace-pre-wrap">
              {comment.text}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="beige" onClick={() => window.history.back()}>Back</Button>
          </div>
        </div>
      </div>
    );
}