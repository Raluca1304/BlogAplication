import React, { useState, useEffect, JSX } from 'react';
import { NavLink, useParams } from "react-router";
import { User } from './types';

interface Article {
  id: string;
  title: string;
  author: string;
  authorId: string;
  summary: string;
  createdDate: string;
}

export function UsersPosts(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [articles, setArticles] = useState<Article[]>([]);
    const [userAuthor, setUserAuthor] = useState<string>("");
    const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  
    useEffect(() => {
        if (!id) return;
        
        const token: string | null = localStorage.getItem("jwt");
        
        // Create fetch options
        const fetchOptions: RequestInit = token 
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {};
  
        // Fetch articles - should work for everyone
        fetch(`/api/articles?authorId=${id}`, fetchOptions)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch articles');
            return res.json();
        })
        .then((data: Article[]) => setArticles(data))
        .catch(err => console.error("Error fetching articles: ", err));
  
        // Fetch user info - should work for everyone  
        fetch(`/api/users/${id}`, fetchOptions)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch user');
            return res.json();
        })
        .then((user: User) => {
          if (user && user.firstName && user.lastName) {
            setUserAuthor(`${user.firstName} ${user.lastName}`);
          } else {
            setUserAuthor("Unknown Author");
          }
        })
        .catch(err => console.error("Error fetching user: ", err));
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
  
    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
                <NavLink 
                    to="/public/posts"
                    // style={{
                    //     color: '#007bff',
                    //     textDecoration: 'none',
                    //     fontSize: '14px'
                    // }}
                >
                    ← Back to All Posts
                </NavLink>
            </div>
            
            <h2 style={{ marginBottom: '30px', color: '#333' }}>
                {userAuthor ? `${userAuthor}'s Articles` : 'Loading Author...'}
            </h2>
            
            {Array.isArray(filteredArticles) && filteredArticles.length > 0 ? (
                <div style={{ 
                    display: 'grid', 
                    gap: '20px',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))'
                }}>
                    {filteredArticles.map((article) => (
                        <div 
                            key={article.id}
                            style={{
                                backgroundColor: '#fff',
                                border: '1px solid #dee2e6',
                                borderRadius: '8px',
                                padding: '20px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                        >
                            <h3 
                            >
                                {article.title}
                            </h3>

                            <div >
                               
                                <span>{new Date(article.createdDate).toLocaleDateString()}</span>
                            </div>

                            <p style={{ 
                                margin: '0 0 20px 0',
                                color: '#555',
                                lineHeight: '1.6',
                                fontSize: '14px'
                            }}>
                                {article.summary}
                            </p>

                            <div style={{ 
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <NavLink 
                                    to={`/public/posts/${article.id}`}
                                    style={{
                                        display: 'inline-block',
                                        padding: '10px 16px',
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        textDecoration: 'none',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#0056b3';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#007bff';
                                    }}
                                >
                                    Read Full Article →
                                </NavLink>

                                {/* Delete button - only for logged in users who own the article */}
                                {isLoggedIn && article.author === currentUser && (
                                    <button
                                        onClick={() => handleDelete(article.id)}
                                        style={{
                                            padding: '8px 12px',
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#c82333';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#dc3545';
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    color: '#666'
                }}>
                    {userAuthor ? 
                        `${userAuthor} hasn't published any articles yet.` : 
                        'No articles found for this author.'
                    }
                </div>
            )}
        </div>
    );
  } 