import React, { useState, useEffect, JSX } from 'react';
import { NavLink, useParams } from "react-router";
import { User, Article } from '../../types';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import YoutubeExtractor from '../admin/utils/youtubeExtractor';
import { getFeaturedImageUrl } from '../admin/utils/extractImageFromMarkdown';
import { Calendar, CalendarClock, ArrowUpRight, ChevronLeft, BookText } from 'lucide-react';
import { formatDateTime, getInitials } from '../admin/utils/formatDataTime';
import { usePagination, CustomPagination } from '../admin/Actions/CustomPagination';

// Function to format date as "18 Jan 2025"
const formatDateShort = (dateString: string): string => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
};

export function UsersPosts(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [articles, setArticles] = useState<Article[]>([]);
    const [userAuthor, setUserAuthor] = useState<string>("");
    const [authorUser, setAuthorUser] = useState<User | null>(null);
    const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // Use pagination hook with 6 items per page
    const pagination = usePagination(6);
  
    // Reset to page 1 when user changes
    useEffect(() => {
        pagination.resetPage();
    }, [id]);

    useEffect(() => {
        if (!id) return;
        
        setLoading(true);
        setError(null);
        
        const token: string | null = localStorage.getItem("jwt");
        
        const fetchOptions: RequestInit = token 
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {};

        let userInfoFound = false;

        fetch(`/api/articles`, fetchOptions)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch articles');
            return res.json();
        })
        .then((data: Article[]) => {
            
            // Filter by either author name OR authorId to handle both cases
            const userArticles = data.filter(article => 
                article.author === id || article.authorId === id
            );
            
            const sortedUserArticles = userArticles.sort((a, b) => {
                return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
            });
            setArticles(sortedUserArticles);
            
            // If we found articles, use the first one to get user info without extra API call
            if (sortedUserArticles.length > 0) {
                const firstArticle = sortedUserArticles[0];
                setUserAuthor(firstArticle.author);
                setAuthorUser({
                    id: firstArticle.authorId,
                    username: firstArticle.author,
                    firstName: '',
                    lastName: '',
                    email: '',
                    role: ''
                });
                userInfoFound = true; // Mark that we found user info
            }
        })
        .catch(err => {
            console.error("Error fetching articles: ", err);
            setError(err.message);
            // Fallback when no articles found - just use the ID as display name
            if (!userInfoFound) {
                setUserAuthor(id);
                setAuthorUser({
                    id: id,
                    username: id,
                    firstName: '',
                    lastName: '',
                    email: '',
                    role: ''
                });
            }
        })
        .finally(() => setLoading(false));
    }, [id]);
  
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

    const filteredArticles: Article[] = selectedAuthor
      ? articles.filter(a => a.author === selectedAuthor)
      : articles;
    
    // Get paginated articles using the hook
    const currentArticles = pagination.getPaginatedData(filteredArticles);

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
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6 relative">
                <NavLink 
                    to="/public/posts"
                    className="text-gray-800 hover:text-gray-400 transition-colors"
                >
                    <ChevronLeft className="w-8 h-8" />
                </NavLink>
                <h1 className="absolute left-1/2 transform -translate-x-1/2 bold font-extrabold text-3xl ">
                    {authorUser && authorUser.username === currentUser ? 
                        'My Articles' : 
                        `${userAuthor}'s Articles`
                    }
                </h1>
                <div></div> {/* Empty div for balance */}
            </div>

           

            {filteredArticles.length === 0 ? (
                <div className="text-center p-6 bg-gray-100 rounded-md border border-gray-300">
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
            ) : (
                <div className="grid grid-cols-1 gap-6 mb-8 mt-20">
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

                                <div className="flex justify-between items-center pt-4">
                                    <div className="flex gap-2">
                                        {isLoggedIn && article.author === currentUser && (
                                            <>
                                                <Button
                                                    onClick={() => handleEdit(article.id)}
                                                    variant="greenDark"
                                                    size="sm"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(article.id)}
                                                    variant="redDark"
                                                    size="sm"
                                                >
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                    </div>
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