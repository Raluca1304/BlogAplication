import React, { useState, useEffect } from 'react';
import { Post } from '../../../types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArticleFormProps } from '../../../types';
import { FormDataArticle } from '../../../types';
import * as yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';


// Validation schema
const schema = yup
  .object({
    title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
    content: yup.string().required('Content is required').min(10, 'Content must be at least 10 characters')
  })
  .required();

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

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormDataArticle >({
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
        <div className="p-4 max-w-2xl mx-auto">
            <h2>{mode === 'edit' ? 'Edit Article' : 'Create Article'}</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="mb-4">
                    <Input 
                        type="text" 
                        placeholder="Article title" 
                        className="w-full"
                        {...register("title")} 
                    />
                    {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                </div>
                
                <div className="mb-4">
                    <Textarea   
                        placeholder="Article content" 
                        rows={12}
                        className="w-full"
                        {...register("content")} 
                    />
                    {errors.content && <span className="text-red-500 text-sm">{errors.content.message}</span>}
                </div>
                
                <div className="mt-4">
                        <Button type="submit" disabled={saving } variant="greenDark" className="mr-2">
                        {saving ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create Article')}
                    </Button>
                    <Button type="button" onClick={onCancel} disabled={saving} variant="redDark" className="mr-2">
                        Cancel
                    </Button>
                </div>
                
                {error && (
                    <div className="text-red-500 mt-2">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}