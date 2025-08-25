import React, { JSX, useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { Article } from '../../types';
import { Button } from '@/components/ui/button';
import { getInitials, formatDateShort } from '../admin/utils/formatDataTime';
import { getFeaturedImageUrl } from '../admin/utils/extractImageFromMarkdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import YoutubeExtractor from '../admin/utils/youtubeExtractor';
import { ArrowUpRight, BookText, History} from 'lucide-react'; 
import { formatDateTime } from '../admin/utils/formatDataTime';
// Image served from Spring Boot static resources




export function Home(): JSX.Element {
  const [latest, setLatest] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isLoggedIn = localStorage.getItem('jwt') !== null;
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/articles/latest?limit=4')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load latest articles');
        return res.json();
      })
      .then((data: Article[]) => {  
        const sortedArticles = data.sort((a, b) => {
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
        });
        setLatest(sortedArticles);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <React.Fragment>
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Our Blog</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Discover amazing articles, stories, and insights from our community of writers. Explore the latest posts and join the conversation!
        </p>
      </div>

      {/* Principal photo - outside container for full width */}
      <div className="flex justify-left mb-8 gap-4 flex-wrap px-4 ml-80">
        <img 
          src="/api/principal_photo2.jpg" 
          alt="Principal photo2" 
          className="object-top-left h-auto rounded-lg shadow-lg"
          style={{ maxHeight: '600px' }}
        />
        <div className="flex justify-start mb-8 gap-4 px-4 grid grid-rows-2" >
        <img 
          src="/api/principal_photo.jpg" 
          alt="Principal photo" 
          className="max-w-full h-auto rounded-lg shadow-lg mb-10"
          style={{ maxHeight: '250px' }}
        />
        <img 
          src="/api/principal_photo5.jpg" 
          alt="Principal photo6" 
          className="max-w-full h-auto rounded-lg shadow-lg mt-10"
          style={{ maxHeight: '250px' }}
        />
        </div>
        <div className="flex justify-start mb-8 gap-4 px-4" >
          <img 
          src="/api/principal_photo3.jpg" 
          alt="Principal photo5" 
          className="max-w-full h-auto rounded-lg shadow-lg"
          style={{ maxHeight: '600px' }}
        />
        </div>




      </div>
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-2xl font-semibold">Latest posts</h2>
        </div>

        {loading && (
          <div className="p-4 text-center">Loading latest posts...</div>
        )}

        {error && (
          <div className="p-4 text-center text-red-500">{error}</div>
        )}

        {!loading && !error && latest.length === 0 && (
          <div className="p-4 text-center text-gray-600">No posts yet.</div>
        )}

        <div className="grid grid-cols-1 gap-6 mb-8">
          {latest.map((article) => (
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
                    {/* Process content to handle YouTube directives and other tools */}
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
          ))
          }
        </div>
      </div>
      
      {/* Navigation link - outside container for full width centering */}
      <div className="flex justify-center items-center  w-full">
        {!isLoggedIn ? (
          <Button variant="navy" className="max-w-sm w-full">
            <NavLink to={`/public/login`}>Join to see more</NavLink>
          </Button>
        ) : (
          <NavLink 
            className="text-gray-800 hover:text-gray-400 transition-colors font-medium text-center px-4 py-2 " 
            to={`/public/posts`}
          >
            Go to all articles →
          </NavLink>
        )}
      </div>
    </React.Fragment>
  );
}