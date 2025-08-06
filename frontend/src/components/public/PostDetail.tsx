import React, { useState, useEffect, JSX } from 'react';
import { NavLink, useParams } from "react-router";

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
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Loading article...</h2>
            </div>
        );
    }

    if (error && !article) {
        return (
            <div style={{ padding: '20px' }}>
                <h2>Error</h2>
                <p style={{ color: 'red' }}>{error}</p>
                <NavLink 
                    to="/public/posts"
                    style={{
                        display: 'inline-block',
                        padding: '10px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        marginTop: '10px'
                    }}
                >
                    ← Back to All Posts
                </NavLink>
            </div>
        );
    }

    if (!article) {
        return (
            <div style={{ padding: '20px' }}>
                <h2>Article not found</h2>
                <NavLink 
                    to="/public/posts"
                    style={{
                        display: 'inline-block',
                        padding: '10px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px'
                    }}
                >
                    ← Back to All Posts
                </NavLink>
            </div>
        );
    }
    
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            {/* Navigation */}
            <div style={{ marginBottom: '20px' }}>
                <NavLink 
                    to="/public/posts"
                    style={{
                        color: '#007bff',
                        textDecoration: 'none',
                        fontSize: '14px'
                    }}
                >
                    ← Back to All Posts
                </NavLink>
            </div>

            {/* Article Content */}
            <article style={{ 
                backgroundColor: '#fff',
                padding: '30px',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                marginBottom: '30px'
            }}>
                <h1 style={{ 
                    margin: '0 0 20px 0',
                    color: '#333',
                    lineHeight: '1.3'
                }}>
                    {article.title}
                </h1>

                <div
                style={{ 
                    marginBottom: '30px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    fontSize: '14px',
                    color: '#666'
                }}
                >
                    <span>By</span>
                    <NavLink 
                        to={`/public/users/${article.authorId}`}
                        style={{
                            color: '#007bff',
                            textDecoration: 'none',
                            fontWeight: '600'
                        }}
                    >
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

                <div style={{ 
                    lineHeight: '1.7',
                    fontSize: '16px',
                    color: '#333'
                }}>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{article.content}</p>
                </div>
            </article>

            {isLoggedIn ? (
                <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '30px',
                    borderRadius: '8px',
                    border: '1px solid #dee2e6'
                }}>
                    <h3 style={{ 
                        margin: '0 0 25px 0',
                        color: '#333'
                    }}>
                        Comments ({comments.length})
                    </h3>

                    {/* Add Comment Form */}
                    <form onSubmit={handleAddComment} style={{ marginBottom: '30px' }}>
                        {error && typeof error === 'string' && (
                            <div style={{
                                padding: '10px',
                                backgroundColor: '#f8d7da',
                                color: '#721c24',
                                border: '1px solid #f5c6cb',
                                borderRadius: '4px',
                                marginBottom: '15px'
                            }}>
                                {error}
                            </div>
                        )}
                        {success && (
                            <div style={{
                                padding: '10px',
                                backgroundColor: '#d4edda',
                                color: '#155724',
                                border: '1px solid #c3e6cb',
                                borderRadius: '4px',
                                marginBottom: '15px'
                            }}>
                                {success}
                            </div>
                        )}
                        <textarea
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Write your comment here..."
                            style={{
                                width: '100%',
                                minHeight: '100px',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                resize: 'vertical',
                                marginBottom: '10px'
                            }}
                            disabled={submittingComment}
                        />
                        <button 
                            type="submit"
                            disabled={submittingComment || !newComment.trim()}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: submittingComment || !newComment.trim() ? '#ccc' : '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: submittingComment || !newComment.trim() ? 'not-allowed' : 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            {submittingComment ? 'Adding Comment...' : 'Add Comment'}
                        </button>
                    </form>

                    {/* Comments List */}
                    {loadingComments ? (
                        <p>Loading comments...</p>
                    ) : comments.length === 0 ? (
                        <p style={{ 
                            textAlign: 'center',
                            color: '#666',
                            fontStyle: 'italic',
                            padding: '20px'
                        }}>
                            No comments yet. Be the first to comment!
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {comments.map((comment) => (
                                <div 
                                    key={comment.id}
                                    style={{
                                        backgroundColor: 'white',
                                        padding: '15px',
                                        borderRadius: '6px',
                                        border: '1px solid #dee2e6'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '10px'
                                    }}>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            <strong style={{ color: '#333' }}>
                                                {comment.authorName || 'Anonymous'}
                                            </strong>
                                            {comment.createdDate && (
                                                <span style={{ marginLeft: '10px' }}>
                                                    {new Date(comment.createdDate).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p style={{ 
                                        margin: 0,
                                        lineHeight: '1.5',
                                        color: '#333'
                                    }}>
                                        {comment.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                /* Message for non-logged users */
                <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '30px',
                    borderRadius: '8px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center'
                }}>
                    <h3 style={{ 
                        margin: '0 0 20px 0',
                        color: '#333'
                    }}>
                        Join the Discussion!
                    </h3>
                    <p style={{ 
                        margin: '0 0 25px 0',
                        color: '#666',
                        fontSize: '16px',
                        lineHeight: '1.6'
                    }}>
                        Log in to see comments and join the conversation with other readers.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                        <NavLink 
                            to="/login"
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '6px',
                                fontSize: '15px',
                                fontWeight: '500',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#0056b3';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#007bff';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            Login
                        </NavLink>  
                    </div>
                </div>
            )}
        </div>
    );
}