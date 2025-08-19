import React, { useState, useEffect, JSX } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { NavLink, useSearchParams } from "react-router";
import { Article } from '../../types';
import { Button } from '@/components/ui/button';
import YoutubeExtractor from '../admin/utils/youtubeExtractor';
import { Calendar, CalendarClock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDateTime } from '../admin/utils/formatDataTime';

export function AllPosts(): JSX.Element {
    const [searchParams] = useSearchParams();
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const searchQuery = searchParams.get('search') || '';
    const searchBy = searchParams.get('searchBy') || '';

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
                const sortedArticles = data.sort((a, b) => {
                    return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
                });
                setArticles(sortedArticles);
            })
            .catch((err) => {
                console.error("Error fetching articles:", err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="p-4 text-center">
                <h2>Loading articles...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <h2>Error</h2>
                <p className="text-red-500">{error}</p>
                <Button onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        );
    }

    const authors: string[] = Array.from(new Set(
        articles.map(a => a.author).filter(a => a && a.trim() !== "")
    )).sort((a, b) => a.localeCompare(b));
    
    const filteredArticles: Article[] = articles.filter(article => {
        // Filter by author if selected
        if (selectedAuthor && article.author !== selectedAuthor) {
            return false;
        }
        
        // Filter by search query if provided
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            // Search only by title
            return article.title.toLowerCase().includes(query);
        }
        
        return true;
    });

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <h1 className="p-0 m-0 bold font-extrabold text-2xl">All Posts</h1>
                {!searchQuery && (
                    <div className="flex items-center gap-2">
                        <Select value={selectedAuthor || ''} onValueChange={(value) => setSelectedAuthor(value || null)}>
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Select an author" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Authors</SelectLabel>
                                    <SelectItem value="all">All Authors ({articles.length} articles)</SelectItem>
                                    {authors.map((author) => (
                                        <SelectItem key={author} value={author}>
                                            {author} ({articles.filter(a => a.author === author).length})
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {selectedAuthor && (
                            <Button
                                onClick={() => setSelectedAuthor(null)}
                                variant="outline"
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {(selectedAuthor || searchQuery) && (
                <div className="mb-4 p-4 bg-gray-100 rounded-md border border-gray-300">
                    {selectedAuthor && searchQuery ? (
                        <>Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} by <strong>{selectedAuthor}</strong> matching "<strong>{searchQuery}</strong>"</>
                    ) : selectedAuthor ? (
                        <>Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} by <strong>{selectedAuthor}</strong></>
                    ) : (
                        <>Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} matching "<strong>{searchQuery}</strong>"</>
                    )}
                </div>
            )}

            {filteredArticles.length === 0 ? (
                <div className="text-center p-4 bg-gray-100 rounded-md border border-gray-300">
                    {selectedAuthor ? 
                        `No articles found by ${selectedAuthor}` : 
                        'No articles available yet.'
                    }
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredArticles.map((article) => (
                        <div 
                            key={article.id}
                            className="p-4 bg-white rounded-md border border-gray-300 transition-all duration-200 cursor-pointer"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                            }}
                        >
                            <h3 className="mb-4 text-lg font-semibold">
                                {article.title}
                            </h3>

                            <div className="mb-4 flex items-center gap-1 text-sm text-gray-600">
                                <span>Created by</span>
                                <NavLink 
                                    to={`/public/users/${article.authorId}`} 
                                    className="text-beige hover:text-beige"
                                >
                                    {article.author}
                                </NavLink>
                                <div className="flex items-center gap-1 ml-3">
                                    <Calendar className="w-4 h-4" />
                                    {formatDateTime(article.createdDate)} 
                                </div>
                            </div>

                            <div className="mb-4 text-gray-700 prose prose-sm max-w-none">
                                {article.summary ? (
                                    <div>
                                        {/* Process content to handle YouTube directives */}
                                        {article.summary.split(/(:youtube\[[^\]]+\])/).map((part, index) => {
                                            const youtubeMatch = part.match(/:youtube\[([^\]]+)\]/);
                                            if (youtubeMatch) {
                                                return <YoutubeExtractor key={index} id={youtubeMatch[1]} />;
                                            }
                                            return part ? (
                                                <ReactMarkdown key={index} remarkPlugins={[remarkGfm]}>
                                                    {part}
                                                </ReactMarkdown>
                                            ) : null;
                                        })}
                                    </div>
                                ) : (
                                    <p>No summary available</p>
                                )}
                            </div>

                            <Button variant="navy">
                                <NavLink 
                                to={`/public/posts/${article.id}`}>
                                Read Full Article →
                                </NavLink>
                            </Button>
                            
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}