import React, { useState, useEffect } from 'react';
import { Comment, CommentFormProps, FormDataComment } from '../../../types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { NavLink } from 'react-router';
import { ChevronLeft } from 'lucide-react';

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
    const [initialText, setInitialText] = useState<string>(initialData?.text || '');
    const [currentText, setCurrentText] = useState<string>(initialData?.text || '');

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormDataComment>({
        resolver: yupResolver(schema),
        defaultValues: {
            text: initialData?.text || ''
        }
    });

    // Watch for changes in the text field
    const watchedText = watch('text');
    
    // Check if form has been modified
    const hasChanges = currentText !== initialText;

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
                    setInitialText(data.text || '');
                    setCurrentText(data.text || '');
                })
                .catch(() => setError('Could not load comment.'))
                .finally(() => setLoading(false));
        }
    }, [commentId, initialData, mode, setValue]);

    // Update current text when form changes
    useEffect(() => {
        setCurrentText(watchedText || '');
    }, [watchedText]);

    const onSubmit = async (data: any) => {
        if (!data.text.trim()) {
            setError('Comment text cannot be empty');
            return;
        }

        // Don't submit if no changes were made
        if (mode === 'edit' && !hasChanges) {
            setError('No changes were made to save.');
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
        return <div className="p-4 text-center">Loading comment...</div>;
    }

    return (
        <div className="p-4 max-w-5xl mx-auto">
            {/* Back Navigation */}
            <div className="flex items-center text-sm text-gray-600 mb-4 mt-5">
                <NavLink to="/admin/comments" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Back to All Comments
                </NavLink>
            </div>

            <Card className="max-w-3xl mx-auto">
                <CardHeader className="border-b">
                    <CardTitle className="text-2xl">
                        {mode === 'edit' ? 'Edit Comment' : 'Create Comment'}
                    </CardTitle>
                    {showArticleInfo && comment && mode === 'edit' && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md border">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Article:</span>
                                    <p className="text-gray-900">{comment.article.title}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Author:</span>
                                    <p className="text-gray-900">{comment.authorName}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Created:</span>
                                    <p className="text-gray-900">{new Date(comment.createdDate).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardHeader>
                
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Comment Text
                            </label>
                            <Textarea 
                                placeholder="Enter your comment..." 
                                className="w-full min-h-[120px] resize-none"
                                {...register("text")} 
                            />
                            {errors.text && (
                                <span className="text-red-500 text-sm mt-1 block">
                                    {errors.text.message}
                                </span>
                            )}
                        </div>
                        
                        {error && (
                            <div className="p-3 text-red-700 bg-red-50 border border-red-200 rounded-md">
                                {error}
                            </div>
                        )}
                        
                        <div className="flex items-center justify-end gap-3 pt-4 border-t">
                            <Button 
                                type="button" 
                                onClick={onCancel} 
                                disabled={saving} 
                                variant="redDark"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={saving || (mode === 'edit' && !hasChanges)} 
                                variant="greenDark"
                            >
                                {saving ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create Comment')}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}