import React, { useState, useEffect } from 'react';
import { Post } from '../../../types';

interface ArticleFormProps {
    articleId?: string;
    initialData?: Partial<Post>;
    onSave: (article: Post) => void;
    onCancel: () => void;
    mode: 'create' | 'edit';
}

export function ArticleForm({ 
    articleId, 
    initialData, 
    onSave, 
    onCancel, 
    mode 
}: ArticleFormProps) {
    const [title, setTitle] = useState<string>(initialData?.title || '');
    const [content, setContent] = useState<string>(initialData?.content || '');
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (mode === 'edit' && articleId && !initialData) {
            setLoading(true);
            fetch(`/api/articles/${articleId}`)
                .then(res => res.json())
                .then((data: Post) => {
                    setTitle(data.title || '');
                    setContent(data.content || '');
                })
                .catch(() => setError('Could not load article.'))
                .finally(() => setLoading(false));
        }
    }, [articleId, initialData, mode]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError(null);
        
        if (!title.trim() || !content.trim()) {
            setError('Title and content are required');
            return;
        }
        
        setSaving(true);
        const token: string | null = localStorage.getItem('jwt');
        
        try {
            const url = mode === 'edit' ? `/api/articles/${articleId}` : '/api/articles';
            const method = mode === 'edit' ? 'PUT' : 'POST';
            
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title, content })
            });
            
            if (res.ok) {
                const savedArticle: Post = await res.json();
                onSave(savedArticle);
            } else {
                setError(`Could not ${mode} article.`);
            }
        } catch {
            setError(`Could not ${mode} article.`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '20px' }}>
                <p>Loading article...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>{mode === 'edit' ? 'Edit Article' : 'Create Article'}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label 
                        htmlFor="articleTitle" 
                        style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}
                    >
                        Title:
                    </label>
                    <input
                        id="articleTitle"
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        disabled={saving}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '16px',
                            fontFamily: 'inherit'
                        }}
                        placeholder="Enter article title..."
                    />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                    <label 
                        htmlFor="articleContent" 
                        style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}
                    >
                        Content:
                    </label>
                    <textarea
                        id="articleContent"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        required
                        disabled={saving}
                        rows={12}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                        }}
                        placeholder="Enter article content..."
                    />
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="submit"
                        disabled={saving || !title.trim() || !content.trim()}
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
                        {saving ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create Article')}
                    </button>
                    <button
                        type="button"
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
            </form>
        </div>
    );
}