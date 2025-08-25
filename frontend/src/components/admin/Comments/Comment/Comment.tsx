import React, { useState, useEffect, JSX } from 'react';
import { NavLink, useParams } from "react-router";
import { Comment as CommentType } from '../../../../types';
import { CommentForm } from '../../forms/CommentForm';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { formatDateTime } from '../../utils/formatDataTime';

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
            <div className="p-4 text-center">
                Loading comment...
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
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">
                            Comment Details
                        </CardTitle>
                        <Button variant="greenDark" onClick={handleEditClick}>
                            Edit Comment
                        </Button>
                    </div>
                    
                    {/* Article Info */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-md border">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Article:</span>
                                <p className="text-gray-900">
                                   
                                        {comment.article.title}

                                </p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Author:</span>
                                <p className="text-gray-900">{comment.authorName || 'Anonymous'}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Created:</span>
                                <p className="text-gray-900">{formatDateTime(comment.createdDate)}</p>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="p-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comment Text
                        </label>
                        <div className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md bg-gray-50 whitespace-pre-wrap text-sm">
                            {comment.text}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}