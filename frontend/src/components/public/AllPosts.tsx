import React, { useState, useEffect, JSX } from 'react';
import { NavLink } from "react-router";
import { Article } from '../../types';


export function AllPosts(): JSX.Element {
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        fetch("/api/articles")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch articles');
                }
                return response.json();
            })
            .then((data: Article[]) => {
                console.log("All articles data:", data);
                setArticles(data);
            })
            .catch((err) => {
                console.error("Error fetching articles:", err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Loading articles...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px' }}>
                <h2>Error</h2>
                <p style={{ color: 'red' }}>{error}</p>
                <button onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    const authors: string[] = Array.from(new Set(
        articles.map(a => a.author).filter(a => a && a.trim() !== "")
    )).sort((a, b) => a.localeCompare(b));
    
    const filteredArticles: Article[] = selectedAuthor
        ? articles.filter(a => a.author === selectedAuthor)
        : articles;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '30px',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                <h1 style={{ margin: 0 }}>All Articles</h1>
                
                {/* Author Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label htmlFor="authorFilter" style={{ fontWeight: 'bold' }}>
                        Filter by Author:
                    </label>
                    <select
                        id="authorFilter"
                        value={selectedAuthor || ''}
                        onChange={(e) => setSelectedAuthor(e.target.value || null)}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            backgroundColor: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="">All Authors ({articles.length} articles)</option>
                        {authors.map((author) => (
                            <option key={author} value={author}>
                                {author} ({articles.filter(a => a.author === author).length})
                            </option>
                        ))}
                    </select>
                    {selectedAuthor && (
                        <button
                            onClick={() => setSelectedAuthor(null)}
                            style={{
                                padding: '8px 12px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {selectedAuthor && (
                <div style={{ 
                    marginBottom: '20px', 
                    padding: '10px', 
                    backgroundColor: '#e9ecef', 
                    borderRadius: '4px',
                    fontSize: '14px'
                }}>
                    Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} by <strong>{selectedAuthor}</strong>
                </div>
            )}

            {filteredArticles.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '40px', 
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    color: '#666'
                }}>
                    {selectedAuthor ? 
                        `No articles found by ${selectedAuthor}` : 
                        'No articles available yet.'
                    }
                </div>
            ) : (
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
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                            }}
                        >
                            <h3 style={{ 
                                margin: '0 0 15px 0', 
                                color: '#333',
                                fontSize: '1.3em',
                                lineHeight: '1.4'
                            }}>
                                {article.title}
                            </h3>

                            <div style={{ 
                                marginBottom: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontSize: '14px',
                                color: '#666'
                            }}>
                                <span>Created by</span>
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}