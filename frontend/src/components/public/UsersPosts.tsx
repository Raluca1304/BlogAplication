import React, { useState, useEffect, JSX } from 'react';
import { NavLink, useParams } from "react-router";
import { User, Article } from '../../types';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import YoutubeExtractor from '../admin/utils/youtubeExtractor';

export function UsersPosts(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [articles, setArticles] = useState<Article[]>([]);
    const [userAuthor, setUserAuthor] = useState<string>("");
    const [authorUser, setAuthorUser] = useState<User | null>(null);
    const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  
    useEffect(() => {
        if (!id) return;
        
        console.log("UsersPosts: Loading data for user ID/username:", id);
        const token: string | null = localStorage.getItem("jwt");
        
        const fetchOptions: RequestInit = token 
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {};

        fetch(`/api/articles`, fetchOptions)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch articles');
            return res.json();
        })
        .then((data: Article[]) => {
            const userArticles = data.filter(article => article.author === id);
            const sortedUserArticles = userArticles.sort((a, b) => {
                return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
            });
            setArticles(sortedUserArticles);
        })
        .catch(err => console.error("Error fetching articles: ", err));
  
        console.log("Setting author name from URL parameter:", id);
        setUserAuthor(id || "Unknown Author");
        
        if (id) {
          setAuthorUser({
            id: '',
            username: id,
            firstName: '',
            lastName: '',
            email: '',
            role: ''
          });
        }
    }, [id]);
  
    const filteredArticles: Article[] = selectedAuthor
      ? articles.filter(a => a.author === selectedAuthor)
      : articles;
  
    const currentUser: string | null = localStorage.getItem("username");
    const isLoggedIn = !!localStorage.getItem("jwt");

    const handleDelete = async (articleId: string): Promise<void> => {
      const token: string | null = localStorage.getItem("jwt");
      if (!token) {
        alert("You need to be logged in to delete articles!");
        return;
      }
      
      if (!window.confirm("Are you sure you want to delete this article?")) return;
      
      try {
        const res = await fetch(`/api/articles/${articleId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setArticles(articles.filter(a => a.id !== articleId));
          alert("Article deleted successfully!");
        } else {
          alert("You are not allowed to delete this article!");
        }
      } catch (err) {
        alert("Error deleting article!");
      }
    };

    const handleEdit = (articleId: string): void => {
      window.location.href = `/public/articles/${articleId}/edit`;
    };
  
    return (
        <div  className="p-4 max-w-2xl mx-auto mt-10">
            <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
                <Button variant="burgundy">   
                    <NavLink 
                        to={`/public/posts`}>
                        ← Back to All Posts
                    </NavLink>
                </Button>
            </div>
            
            <h2 className="mb-4 text-2xl font-bold text-center">
                {authorUser && authorUser.username === currentUser ? 
                    'My Articles' : 
                    `${userAuthor}'s Articles`
                }
            </h2>
            
            {Array.isArray(filteredArticles) && filteredArticles.length > 0 ? (
                <div>
                    {filteredArticles.map((article) => (
                        <div 
                            key={article.id}
                            className="mb-4 p-4 border border-gray-300 rounded-md shadow-md"
                        >
                            <h3 className="text-lg font-semibold mb-2">
                                {article.title}
                            </h3>

                            <div className="flex justify-between items-center mb-2">
                               
                                <span>{new Date(article.createdDate).toLocaleDateString()}</span>
                            </div>

                            <div className="mb-4 text-gray-700 prose prose-sm max-w-none">
                                {article.summary ? (
                                    <div>
                                        {article.summary.split(/(:youtube\[[^\]]+\])/).map((part, index) => {
                                            const youtubeMatch = part.match(/:youtube\[([^\]]+)\]/);
                                            if (youtubeMatch) {
                                                return <YoutubeExtractor key={index} id={youtubeMatch[1]} />;
                                            }
                                            return part ? (
                                                <ReactMarkdown 
                                                    key={index} 
                                                    remarkPlugins={[remarkGfm]}
                                                    rehypePlugins={[rehypeHighlight]}
                                                >
                                                    {part}
                                                </ReactMarkdown>
                                            ) : null;
                                        })}
                                    </div>
                                ) : (
                                    <p>No summary available</p>
                                )}
                            </div>

                            <div className="flex justify-between items-center gap-4">
                                <Button variant="navy">
                                    <NavLink 
                                        to={`/public/posts/${article.id}`}>
                                        Read Full Article →
                                    </NavLink>
                                </Button>
                                
                                {isLoggedIn && article.author === currentUser && (
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleEdit(article.id)}
                                            variant="greenDark"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(article.id)}
                                            variant="redDark"
                                        >
                                            Delete
                                        </Button> 
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-6 bg-gray-100 rounded-md">
                    {authorUser && authorUser.username === currentUser ? (
                        <div>
                            <p className="mb-4 text-gray-600">You haven't published any articles yet.</p>
                            <Button variant="greenDark">
                                <NavLink to="/public/articles/create">
                                    Create Your First Article
                                </NavLink>
                            </Button>
                        </div>
                    ) : (
                        <p className="text-gray-600">{userAuthor} hasn't published any articles yet.</p>
                    )}
                </div>
            )}
        </div>
    );
  } 