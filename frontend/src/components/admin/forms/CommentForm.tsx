import React, { useState, useEffect } from 'react';
import { Comment } from '../../../types';

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
    const [text, setText] = useState<string>(initialData?.text || '');
    const [comment, setComment] = useState<Comment | null>(initialData as Comment || null);
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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
                    setText(data.text || '');
                })
                .catch(() => setError('Could not load comment.'))
                .finally(() => setLoading(false));
        }
    }, [commentId, initialData, mode]);

    const handleSave = async () => {
        if (!text.trim()) {
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
                body: JSON.stringify({ text })
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
        return (
            <div style={{ padding: '20px' }}>
                <p>Loading comment...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>{mode === 'edit' ? 'Edit Comment' : 'Create Comment'}</h2>
            
            {/* Article info section - only show for edit mode with article info */}
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

            <div style={{ marginBottom: '20px' }}>
                <label 
                    htmlFor="commentText" 
                    style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}
                >
                    Comment Text:
                </label>
                <textarea
                    id="commentText"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={6}
                    disabled={saving}
                    style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                    }}
                    placeholder="Enter your comment..."
                />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={handleSave}
                    disabled={saving || !text.trim()}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: saving ? '#ccc' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    {saving ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create Comment')}
                </button>
                <button
                    onClick={onCancel}
                    disabled={saving}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    Cancel
                </button>
            </div>
            
            {error && (
                <div style={{
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    border: '1px solid #f5c6cb',
                    borderRadius: '4px'
                }}>
                    {error}
                </div>
            )}
        </div>
    );
}