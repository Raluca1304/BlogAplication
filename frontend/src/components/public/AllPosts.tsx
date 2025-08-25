import React, { useState, useEffect, JSX } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { NavLink, useSearchParams } from "react-router";
import { Article } from '../../types';
import { Button } from '@/components/ui/button';
import YoutubeExtractor from '../admin/utils/youtubeExtractor';
import { ArrowUpRight, Calendar, CalendarClock, BookText } from 'lucide-react';
import { getInitials, formatDateShort } from '../admin/utils/formatDataTime';
import { getFeaturedImageUrl } from '../admin/utils/extractImageFromMarkdown';
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
import { usePagination, CustomPagination } from '../admin/Actions/CustomPagination';

export function AllPosts(): JSX.Element {
    const [searchParams] = useSearchParams();
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const searchQuery = searchParams.get('search') || '';
    const searchBy = searchParams.get('searchBy') || '';
    
    // Use pagination hook with 6 items per page
    const pagination = usePagination(6);

    // Reset to page 1 when filters change
    useEffect(() => {
        pagination.resetPage();
    }, [selectedAuthor, searchQuery]);

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

    // Get paginated articles using the hook
    const currentArticles = pagination.getPaginatedData(filteredArticles);

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <h1 className="p-0 m-0 bold font-extrabold text-2xl">All Posts</h1>
                {!searchQuery && (
                    <div className="flex items-center gap-2">
                        <Select value={selectedAuthor || 'all'} onValueChange={(value) => setSelectedAuthor(value === 'all' ? null : value)}>
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
                <div className="mb-4 p-4 bg-gray-100 rounded-md ">
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
                <div className="grid grid-cols-1 gap-6 mb-8">
                    {currentArticles.map((article) => (
                        <div 
                            key={article.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-row"
                        >
                            {/* Card Image */}
                            <div className="w-64 h-48 relative flex-shrink-0 overflow-hidden">
                                {getFeaturedImageUrl(article) ? (
                                    <img 
                                        src={getFeaturedImageUrl(article)!} 
                                        alt={article.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback to placeholder if image fails to load
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const fallback = target.nextElementSibling as HTMLElement;
                                            if (fallback) fallback.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                
                                {/* Fallback placeholder - shown when no image or image fails to load */}
                                <div 
                                    className={`absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ${
                                        getFeaturedImageUrl(article) ? 'hidden' : 'flex'
                                    }`}
                                >
                                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                                        <BookText className="h-12 w-12 text-white opacity-80" />
                                    </div>
                                </div>
                                
                                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-semibold text-gray-800 shadow-sm">
                                    {formatDateShort(article.createdDate)}
                                </div>
                            </div>
                            
                            {/* Card Content */}
                            <div className="p-6 flex flex-col flex-grow justify-between">
                                <div className="flex items-center gap-2 mb-3">
                                    <NavLink to={`/public/users/${article.authorId}`}>
                                        <Button
                                            variant="newRounded"
                                            title="View Profile"
                                        >
                                            {getInitials(article.author)}
                                        </Button>
                                    </NavLink>
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <NavLink 
                                            to={`/public/users/${article.authorId}`}
                                            className="text-gray-800 hover:text-gray-400 transition-colors"
                                        >
                                            {article.author}
                                        </NavLink>
                                        <span className="text-gray-400">•</span>
                                        <span>{formatDateShort(article.createdDate)}</span>
                                    </div>
                                </div>
                                
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 leading-tight">
                                    {article.title}
                                </h3>
                                
                                <div className="text-gray-700 text-sm mb-4 prose prose-sm max-w-none flex-grow
                                    prose-headings:text-gray-900 prose-headings:font-bold
                                    prose-h1:text-2xl prose-h1:mb-3 prose-h1:mt-4
                                    prose-h2:text-xl prose-h2:mb-2 prose-h2:mt-3
                                    prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-3
                                    prose-h4:text-base prose-h4:mb-1 prose-h4:mt-2
                                    prose-h5:text-sm prose-h5:mb-1 prose-h5:mt-2
                                    prose-h6:text-xs prose-h6:mb-1 prose-h6:mt-1
                                    prose-p:text-gray-700 prose-p:leading-6 prose-p:mb-2
                                    prose-ul:mb-2 prose-ol:mb-2 prose-li:mb-1
                                    prose-blockquote:border-l-2 prose-blockquote:border-gray-300 prose-blockquote:pl-2 prose-blockquote:italic
                                    prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-code:text-xs
                                    prose-pre:bg-gray-800 prose-pre:text-white prose-pre:p-2 prose-pre:rounded prose-pre:overflow-x-auto prose-pre:text-xs
                                    prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800
                                    prose-strong:font-bold prose-em:italic">
                                    {article.summary ? (
                                        <div className="line-clamp-3">
                                            {article.summary.split(/(:youtube\[[^\]]+\])/).map((part: string, index: number) => {
                                                const youtubeMatch = part.match(/:youtube\[([^\]]+)\]/);
                                                if (youtubeMatch) {
                                                    return <YoutubeExtractor key={index} id={youtubeMatch[1]} />;
                                                }
                                                return part ? (
                                                    <ReactMarkdown key={index} remarkPlugins={[remarkGfm]}>
                                                        {part.length > 200 ? part.substring(0, 200) + '...' : part}
                                                    </ReactMarkdown>
                                                ) : null;
                                            })}
                                        </div>
                                    ) : (
                                        <p>No summary available</p>
                                    )}
                                </div>

                                <div className="flex justify-end pt-4">
                                    <NavLink 
                                        to={`/public/posts/${article.id}`}
                                        className="text-gray-800 hover:text-gray-400 transition-colors group"
                                    >
                                        <ArrowUpRight className="h-5 w-5 group-hover:scale-110 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CustomPagination
                currentPage={pagination.currentPage}
                totalItems={filteredArticles.length}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={pagination.handlePageChange}
                itemName="articles"
            />
        </div>
    );
}