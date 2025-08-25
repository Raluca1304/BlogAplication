import React, { useState, useEffect, JSX } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { NavLink, useParams } from "react-router";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import YoutubeExtractor from '../admin/utils/youtubeExtractor';
import { Calendar, CalendarClock , ChevronLeft, MessageCircle} from 'lucide-react';
import { formatDateTime, formatDateShort } from '../admin/utils/formatDataTime';

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
                    commentsArray.sort((a: Comment, b: Comment) =>
                        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
                    );
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
                    const commentsArray: Comment[] = Array.isArray(data) ? data : [];
                    commentsArray.sort((a: Comment, b: Comment) =>
                        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
                    );
                    setComments(commentsArray);
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
                <NavLink 
                    to="/public/posts"
                    className="text-gray-800 hover:text-gray-400 transition-colors font-medium text-center px-4 py-2 "
                >
                    <ChevronLeft className="w-8 h-8" />
                  
                    </NavLink>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="p-4">
                <h2>Article not found</h2>
                <NavLink 
                    to="/public/posts"
                    className="text-gray-800 hover:text-gray-400 transition-colors font-medium text-center px-4 py-2 "
                >
                    <ChevronLeft className="w-8 h-8" />
                  
                    </NavLink>
            </div>
        );
    }
    
    return (
        <div className="p-4 max-w-2xl mx-auto mt-10">
            {/* Navigation */}
            <div className="mb-4">
                <NavLink 
                    to="/public/posts"
                    className="text-gray-800 hover:text-gray-400 transition-colors font-medium text-center px-4 py-2 "
                >
                    <ChevronLeft className="w-8 h-8" />
                  
                    </NavLink>
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
                    <span>By   <span> </span>
                    <NavLink 
                        to={`/public/users/${article.authorId}`}
                        className="text-beige font-bold">
                        {article.author}
                    </NavLink>
                    </span>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Published: {formatDateShort(article.createdDate)}
                    </div>
                    {article.updatedDate && (
                        <>
                            <div className="flex items-center gap-2">
                                <CalendarClock className="w-4 h-4" />
                                Updated: {formatDateShort(article.updatedDate)}
                            </div>
                        </>
                    )}
                </div>

                <div className="text-gray-700 leading-relaxed text-base max-w-none
                    [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mb-6 [&>h1]:mt-8
                    [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mb-4 [&>h2]:mt-6
                    [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mb-3 [&>h3]:mt-5
                    [&>h4]:text-lg [&>h4]:font-bold [&>h4]:text-gray-900 [&>h4]:mb-2 [&>h4]:mt-4
                    [&>h5]:text-base [&>h5]:font-bold [&>h5]:text-gray-900 [&>h5]:mb-2 [&>h5]:mt-3
                    [&>h6]:text-sm [&>h6]:font-bold [&>h6]:text-gray-900 [&>h6]:mb-1 [&>h6]:mt-2
                    [&>p]:text-gray-700 [&>p]:leading-7 [&>p]:mb-4
                    [&>ul]:mb-4 [&>ol]:mb-4 [&>li]:mb-1
                    [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600
                    [&>code]:bg-gray-100 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono
                    [&>pre]:bg-gray-800 [&>pre]:text-white [&>pre]:p-4 [&>pre]:rounded [&>pre]:overflow-x-auto [&>pre]:font-mono
                    [&>a]:text-blue-600 [&>a]:underline [&>a:hover]:text-blue-800
                    [&>strong]:font-bold [&>em]:italic
                    [&>table]:border-collapse [&>table]:w-full [&>table]:border [&>table]:border-gray-300
                    [&>table>thead>tr>th]:border [&>table>thead>tr>th]:border-gray-300 [&>table>thead>tr>th]:bg-gray-50 [&>table>thead>tr>th]:p-2 [&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:font-semibold
                    [&>table>tbody>tr>td]:border [&>table>tbody>tr>td]:border-gray-300 [&>table>tbody>tr>td]:p-2">
                    {article.content ? (
                        <div>
                            {/* Process content to handle YouTube directives */}
                            {article.content.split(/(:youtube\[[^\]]+\])/).map((part, index) => {
                                const youtubeMatch = part.match(/:youtube\[([^\]]+)\]/);
                                if (youtubeMatch) {
                                    return <YoutubeExtractor key={index} id={youtubeMatch[1]} />;
                                }
                                return part ? (
                                    <ReactMarkdown 
                                        key={index} 
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeHighlight]}
                                        components={{
                                            h1: ({children}) => <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8">{children}</h1>,
                                            h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-6">{children}</h2>,
                                            h3: ({children}) => <h3 className="text-xl font-bold text-gray-900 mb-3 mt-5">{children}</h3>,
                                            h4: ({children}) => <h4 className="text-lg font-bold text-gray-900 mb-2 mt-4">{children}</h4>,
                                            h5: ({children}) => <h5 className="text-base font-bold text-gray-900 mb-2 mt-3">{children}</h5>,
                                            h6: ({children}) => <h6 className="text-sm font-bold text-gray-900 mb-1 mt-2">{children}</h6>,
                                            p: ({children}) => <p className="text-gray-700 leading-7 mb-4">{children}</p>,
                                            code: ({children}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>,
                                            blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">{children}</blockquote>,
                                            a: ({children, href}) => <a href={href} className="text-blue-600 underline hover:text-blue-800">{children}</a>,
                                            strong: ({children}) => <strong className="font-bold">{children}</strong>,
                                            em: ({children}) => <em className="italic">{children}</em>,
                                            ul: ({children}) => <ul className="mb-4 list-disc pl-6">{children}</ul>,
                                            ol: ({children}) => <ol className="mb-4 list-decimal pl-6">{children}</ol>,
                                            li: ({children}) => <li className="mb-1">{children}</li>,
                                            img: ({src, alt}) => <img src={src} alt={alt} className="max-w-full h-auto rounded-lg shadow-md my-4" />
                                        }}
                                    >
                                        {part}
                                    </ReactMarkdown>
                                ) : null;
                            })}
                        </div>
                    ) : (
                        <p>No content available</p>
                    )}
                </div>
            </article>

            {isLoggedIn ? (
                <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
                    <h3 className="mb-5 text-lg font-semibold">
                        Comments ({comments.length})
                    </h3>

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
                                    className="bg-white p-4 rounded-md border border-gray-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MessageCircle className="w-4 h-4" />
                                            <strong className="text-gray-800">
                                                {comment.authorName || 'Anonymous'}
                                            </strong>
                                            {comment.createdDate && (
                                                <span className="ml-2">
                                                    {formatDateShort(comment.createdDate)}
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