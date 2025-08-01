import React, { useState, useEffect, JSX } from 'react';
import { useParams } from "react-router";
import { Comment as CommentType } from '../../../../types';
import { CommentForm } from '../../forms/CommentForm';

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
            <div style={{ padding: '20px' }}>
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
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Comment Details</h2>
                <button
                    onClick={handleEditClick}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Edit Comment
                </button>
            </div>
            <div>
                <p><strong>ID:</strong> {comment.id}</p>
                <p><strong>Author:</strong> {comment.authorName}</p>
                <p><strong>Article:</strong> {comment.article.title}</p>
                <p><strong>Created:</strong> {new Date(comment.createdDate).toLocaleString()}</p>
                <p><strong>Text:</strong></p>
                <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', backgroundColor: '#f9f9f9', marginTop: '10px' }}>
                    {comment.text}
                </div>
            </div>
        </div>
    );
}