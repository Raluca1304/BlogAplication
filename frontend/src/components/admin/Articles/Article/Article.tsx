import React, { useState, useEffect, JSX } from 'react';
import { useParams, NavLink } from "react-router";
import { Post } from '../../../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { formatDateTime } from '../../utils/formatDataTime';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import YoutubeExtractor from '../../utils/youtubeExtractor';
import { Calendar, CalendarClock, ChevronLeft } from 'lucide-react';

export function Article(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Post | null>(null);

  useEffect(() => {
      if (!id) return;

      // GET the article from the API
      fetch(`/api/articles/${id}`)
        .then((res) => res.json())
        .then((data: Post) => setArticle(data))
        .catch((err) => console.error("Eroare la fetch:", err));
    }, [id]);

    // Get the current user from the local storage
    const currentUser: string | null = localStorage.getItem("username");
    
    if (!article || !article.title) {
      return <p>Loading...</p>;
    }
    
    return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Back Navigation */}
      <div className="flex items-center text-sm text-gray-600 mb-4 mt-5">
        <NavLink to="/admin/articles" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          Back to All Articles
        </NavLink>
      </div>
      
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-4xl">  
          <CardHeader className="border-b">
          <CardTitle className="text-2xl">{article.title}</CardTitle>
          <CardDescription>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span>By</span>
            <span className="font-medium">
              {typeof (article as any).author === 'string'
                ? (article as any).author
                : (article as any).author?.username || (article as any).authorName || 'Unknown'}
            </span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Created: {formatDateTime(article.createdDate)}
              </div>
              {article.updatedDate && (
                <>
                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-4 h-4" />
                    Updated: {formatDateTime(article.updatedDate)}
                  </div>
                </>
              )}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="max-w-none py-6 
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
          <div className="text-gray-700 leading-relaxed text-base">
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
        </CardContent>
        </Card>
      </div>
    </div>
    );
  } 