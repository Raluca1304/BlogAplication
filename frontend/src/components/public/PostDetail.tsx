import React, { useState, useEffect, JSX } from 'react';
import { NavLink, useParams } from "react-router";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdDate: string;
  updatedDate?: string;
}

interface Comment {
  id: string;
  text: string;
  authorName?: string;
  createdDate: string;
}

export function PostDetail(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingArticle, setLoadingArticle] = useState<boolean>(true);
    const [loadingComments, setLoadingComments] = useState<boolean>(true);
    const [newComment, setNewComment] = useState<string>("");
    const [error, setError] = useState<string | JSX.Element | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [submittingComment, setSubmittingComment] = useState<boolean>(false);

    const isLoggedIn = !!localStorage.getItem('jwt');
    const currentUser = localStorage.getItem('username');

    useEffect(() => {
        if (!id) return;

        // Load article
        setLoadingArticle(true);
        fetch(`/api/articles/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Article not found');
                }
                return res.json();
            })
            .then((data: Article) => {
                console.log("Article data:", data);
                setArticle(data);
            })
            .catch((err) => {
                console.error("Error fetching article:", err);
                setError("Failed to load article");
            })
            .finally(() => setLoadingArticle(false));

        // Load comments only if user is logged in
        if (isLoggedIn) {
            setLoadingComments(true);
            const token = localStorage.getItem("jwt");
            fetch(`/api/articles/${id}/comments`, {
                headers: token ? { "Authorization": `Bearer ${token}` } : {}
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Failed to load comments');
                    }
                    return res.json();
                })
                .then((data: Comment[] | any) => {
                    const commentsArray = Array.isArray(data) ? data : [];
                    console.log("Comments data:", commentsArray);
                    setComments(commentsArray);
                })
                .catch(err => {
                    console.error("Error loading comments:", err);
                    setComments([]);
                })
                .finally(() => setLoadingComments(false));
        } else {
            setLoadingComments(false);
            setComments([]);
        }
    }, [id, isLoggedIn]);

    const handleAddComment = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        
        if (!newComment.trim()) {
            setError("Comment cannot be empty");
            return;
        }

        setError(null);
        setSuccess(null);
        const token = localStorage.getItem("jwt");
        
        if (!token) {
            setError("You need to be logged in to add a comment!");
            return;
        }
        
        setSubmittingComment(true);
        
        try {
            const res = await fetch(`/api/articles/${id}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text: newComment.trim() })
            });

            if (res.ok) {
                setSuccess("Comment added successfully!");
                setNewComment("");
                
                // Reload comments
                const commentsRes = await fetch(`/api/articles/${id}/comments`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                
                if (commentsRes.ok) {
                    const data = await commentsRes.json();
                    setComments(Array.isArray(data) ? data : []);
                }
            } else {
                setError("Failed to add comment. Please try again.");
            }
        } catch (err) {
            console.error("Error adding comment:", err);
            setError("Failed to add comment. Please try again.");
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loadingArticle) {
        return (
            <div className="p-4 text-center">
                <h2>Loading article...</h2>
            </div>
        );
    }

    if (error && !article) {
        return (
            <div className="p-4">
                <h2>Error</h2>
                <p className="text-red-500">{error}</p>
                <Button variant="burgundy" className="mr-2">
                    <NavLink 
                        to="/public/posts">
                        ← Back to All Posts
                    </NavLink>
                </Button>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="p-4">
                <h2>Article not found</h2>
                <Button variant="burgundy" className="mr-2">
                    <NavLink 
                        to="/public/posts">
                        ← Back to All Posts
                    </NavLink>
                </Button>
            </div>
        );
    }
    
    return (
        <div className="p-4 max-w-2xl mx-auto mt-10">
            {/* Navigation */}
            <div className="mb-4">
                <Button variant="burgundy" className="mr-2">
                    <NavLink 
                        to="/public/posts">
                        ← Back to All Posts
                    </NavLink>
                </Button>
            </div>

            {/* Article Content */}
            <article
                className="bg-white p-6 rounded-md border border-gray-300 mb-6">
                <h1 className="mb-4 text-2xl font-bold">
                    {article.title}
                </h1>

                <div
                className="mb-6 pb-4 border-b border-gray-200 flex items-center gap-4 text-sm text-gray-600"
                >
                    <span>By</span>
                    <NavLink 
                        to={`/public/users/${article.authorId}`}
                        className="text-beige font-bold">
                        {article.author}
                    </NavLink>
                    <span>•</span>
                    <span>Published: {new Date(article.createdDate).toLocaleDateString()}</span>
                    {article.updatedDate && (
                        <>
                            <span>•</span>
                            <span>Updated: {new Date(article.updatedDate).toLocaleDateString()}</span>
                        </>
                    )}
                </div>

                <div className="text-gray-700 leading-relaxed text-base">
                    <p className="whitespace-pre-wrap">{article.content}</p>
                </div>
            </article>

            {isLoggedIn ? (
                <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
                    <h3 className="mb-5 text-lg font-semibold">
                        Comments ({comments.length})
                    </h3>

                    {/* Add Comment Form */}
                    <form onSubmit={handleAddComment} className="mb-6">
                        {error && typeof error === 'string' && (
                                <div className="p-2 bg-red-50 text-red-700 border border-red-200 rounded-md mb-3">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-2 bg-green-50 text-green-700 border border-green-200 rounded-md mb-3">
                                {success}
                            </div>
                        )}
                        <Textarea
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Write your comment here..."    
                            className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md mb-3"
                            disabled={submittingComment}
                        />
                        <Button 
                            type="submit"
                            variant="greenDark"
                            className="mr-2"
                            disabled={submittingComment || !newComment.trim()}
                        >
                            {submittingComment ? 'Adding Comment...' : 'Add Comment'}
                        </Button>
                    </form>

                    {loadingComments ? (
                        <p>Loading comments...</p>
                    ) : comments.length === 0 ? (
                        <p className="text-center text-gray-600 italic py-4">
                            No comments yet. Be the first to comment!
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {comments.map((comment) => (
                                <div 
                                    key={comment.id}
                                    className="bg-white p-4 rounded-md border border-gray-200"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                                <div className="text-sm text-gray-600">
                                            <strong className="text-gray-800">
                                                {comment.authorName || 'Anonymous'}
                                            </strong>
                                            {comment.createdDate && (
                                                <span className="ml-2">
                                                    {new Date(comment.createdDate).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="mb-0 leading-relaxed">
                                        {comment.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                /* Message for non-logged users */
                <div className="bg-gray-50 p-6 rounded-md border border-gray-200 text-center">
                    <h3 className="mb-4 text-lg font-semibold">
                        Join the Discussion!
                    </h3>
                    <p className="mb-5 text-gray-600">
                        Log in to see comments and join the conversation with other readers.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Button variant="navy">
                            <NavLink to="/login">
                                Login
                            </NavLink>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}