import React, { useState, useEffect, JSX } from 'react';
import { useParams } from "react-router";
import { Comment as CommentType } from '../../../../types';
import { CommentForm } from '../../forms/CommentForm';
import { Button } from '@/components/ui/button';

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
        <div className="p-4 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2>Comment Details</h2>
                <Button
                    variant="greenDark"
                    onClick={handleEditClick}
                >
                    Edit Comment
                </Button>
            </div>
            <div>
                <p><strong>ID:</strong> {comment.id}</p>
                <p><strong>Author:</strong> {comment.authorName}</p>
                <p><strong>Article:</strong> {comment.article.title}</p>
                <p><strong>Created:</strong> {new Date(comment.createdDate).toLocaleString()}</p>
                <p><strong>Text:</strong></p>
                <div className="border border-gray-300 rounded-md p-4 bg-gray-100 mt-2">
                    {comment.text}
                </div>
            </div>
        </div>
    );
}