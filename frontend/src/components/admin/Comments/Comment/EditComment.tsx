import React, { useState, useEffect } from 'react';
import { Comment, EditCommentProps } from '../../../../types';
import { CommentForm } from '../../..';

export function EditComment({ commentId }: EditCommentProps) {
    const handleSave = (comment: Comment) => {
        alert('Comment updated successfully!');
        setTimeout(() => {
            window.close();
        }, 1000);
    };

    const handleCancel = () => {
        window.close();
    };

    return (
        <CommentForm 
            commentId={commentId}
            mode="edit"
            onSave={handleSave}
            onCancel={handleCancel}
            showArticleInfo={true}
        />
    );
}

export function EditCommentPage() {
    const [commentId, setCommentId] = useState<string | null>(null);

    useEffect(() => {
        // Extract commentId from URL path
        const pathParts = window.location.pathname.split('/');
        const idIndex = pathParts.findIndex(part => part === 'comments') + 1;
        if (idIndex > 0 && pathParts[idIndex]) {
            setCommentId(pathParts[idIndex]);
        }
    }, []);

    if (!commentId) {
        return (
            <div className="p-4">
                <h2>Invalid comment ID</h2>
                <p>Could not extract comment ID from URL</p>
            </div>
        );
    }
    return <EditComment commentId={commentId} />;
}