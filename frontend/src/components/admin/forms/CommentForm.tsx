import React, { useState, useEffect } from 'react';
import { Comment } from '../../../types';
import { useForm } from 'react-hook-form';

interface CommentFormProps {
    commentId?: string;
    initialData?: Partial<Comment>;
    onSave: (comment: Comment) => void;
    onCancel: () => void;
    mode: 'create' | 'edit';
    showArticleInfo?: boolean;
}

export function CommentForm({ 
    commentId, 
    initialData, 
    onSave, 
    onCancel, 
    mode,
    showArticleInfo = true 
}: CommentFormProps) {
    const [comment, setComment] = useState<Comment | null>(initialData as Comment || null);
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            text: initialData?.text || ''
        }
    });

    useEffect(() => {
        if (mode === 'edit' && commentId && !initialData) {
            setLoading(true);
            const token = localStorage.getItem('jwt');
            
            fetch(`/api/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then((data: Comment) => {
                    setComment(data);
                    setValue('text', data.text || '');
                })
                .catch(() => setError('Could not load comment.'))
                .finally(() => setLoading(false));
        }
    }, [commentId, initialData, mode, setValue]);

    const onSubmit = async (data: any) => {
        if (!data.text.trim()) {
            setError('Comment text cannot be empty');
            return;
        }

        setSaving(true);
        setError(null);
        const token = localStorage.getItem('jwt');

        try {
            const url = mode === 'edit' ? `/api/comments/${commentId}` : '/api/comments';
            const method = mode === 'edit' ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ text: data.text })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const savedComment: Comment = await response.json();
            onSave(savedComment);
        } catch (err: any) {
            console.error('Error saving comment:', err);
            setError(`Failed to ${mode} comment: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div>Loading comment...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>{mode === 'edit' ? 'Edit Comment' : 'Create Comment'}</h2>
            
           
            {showArticleInfo && comment && mode === 'edit' && (
                <div style={{ 
                    marginBottom: '20px', 
                    padding: '15px', 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '5px' 
                }}>
                    <p><strong>Article:</strong> {comment.article.title}</p>
                    <p><strong>Author:</strong> {comment.authorName}</p>
                    <p><strong>Created:</strong> {new Date(comment.createdDate).toLocaleString()}</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <textarea 
                    placeholder="Enter your comment..." 
                    rows={6}
                    {...register("text", {required: true, minLength: 1})} 
                />
                {errors.text && <span>Comment text is required</span>}
                
                <div style={{ marginTop: '20px' }}>
                    <button type="submit" disabled={saving}>
                        {saving ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create Comment')}
                    </button>
                    <button type="button" onClick={onCancel} disabled={saving}>
                        Cancel
                    </button>
                </div>
                
                {error && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}