import React, { useState, useEffect } from 'react';
import { Comment, CommentFormProps, FormDataComment } from '../../../types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { NavLink } from 'react-router';

// Validation schema
const schema = yup
  .object({
    text: yup.string().required('Comment text is required').min(1, 'Comment cannot be empty')
  })
  .required();

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

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormDataComment>({
        resolver: yupResolver(schema),
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
        <div className="p-4 max-w-2xl mx-auto">

            <h2>{mode === 'edit' ? 'Edit Comment' : 'Create Comment'}</h2>           
            {showArticleInfo && comment && mode === 'edit' && (
                <div className="mb-4 p-4 bg-gray-100 rounded-md border border-gray-300">
                    <p><strong>Article:</strong> {comment.article.title}</p>
                    <p><strong>Author:</strong> {comment.authorName}</p>
                    <p><strong>Created:</strong> {new Date(comment.createdDate).toLocaleString()}</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="mb-4 w-full">
                    <Textarea 
                        placeholder="Enter your comment..." 
                        className="w-full"
                        {...register("text")} 
                    />
                    {errors.text && <span className="text-red-500 text-sm">{errors.text.message}</span>}
                </div>
                
                <div className="mt-4">
                    <Button type="submit" disabled={saving} variant="greenDark" className="mr-2">
                        {saving ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create Comment')}
                    </Button>
                    <Button type="button" onClick={onCancel} disabled={saving} variant="redDark" className="mr-2">
                        <NavLink to="/admin/comments">
                            Cancel
                        </NavLink>
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