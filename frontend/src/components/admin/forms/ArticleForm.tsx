import React, { useState, useEffect } from 'react';
import { Post } from '../../../types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface ArticleFormProps {
    articleId?: string;
    initialData?: Partial<Post>;
    onSave: (article: Post) => void;
    onCancel: () => void;
    mode: 'create' | 'edit';
}

// Validation schema
const schema = yup
  .object({
    title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
    content: yup.string().required('Content is required').min(10, 'Content must be at least 10 characters')
  })
  .required();

interface FormData {
    title: string;
    content: string;
}

export function ArticleForm({ 
    articleId, 
    initialData, 
    onSave, 
    onCancel, 
    mode 
}: ArticleFormProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            title: initialData?.title || '',
            content: initialData?.content || ''
        }
    });

    useEffect(() => {
        if (mode === 'edit' && articleId && !initialData) {
            setLoading(true);
            fetch(`/api/articles/${articleId}`)
                .then(res => res.json())
                .then((data: Post) => {
                    setValue('title', data.title || '');
                    setValue('content', data.content || '');
                })
                .catch(() => setError('Could not load article.'))
                .finally(() => setLoading(false));
        }
    }, [articleId, initialData, mode, setValue]);

    const onSubmit = async (data: any) => {
        setError(null);
        
        if (!data.title.trim() || !data.content.trim()) {
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
                body: JSON.stringify({ title: data.title, content: data.content })
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
        return <div>Loading article...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>{mode === 'edit' ? 'Edit Article' : 'Create Article'}</h2>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <input 
                    type="text" 
                    placeholder="Article title" 
                    {...register("title")} 
                />
                {errors.title && <span>{errors.title.message}</span>}
                
                <textarea 
                    placeholder="Article content" 
                    rows={10}
                    {...register("content")} 
                />
                {errors.content && <span>{errors.content.message}</span>}
                
                <div style={{ marginTop: '20px' }}>
                    <button type="submit" disabled={saving}>
                        {saving ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create Article')}
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