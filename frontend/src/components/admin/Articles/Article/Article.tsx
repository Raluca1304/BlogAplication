import React, { useState, useEffect, JSX } from 'react';
import { useParams } from "react-router";
import { Post } from '../../../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '../../utils/formatDataTime';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import YoutubeExtractor from '../../utils/youtubeExtractor';
import { Calendar, CalendarClock } from 'lucide-react';

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
      <Card className="max-w-3xl p-10 ml-100">
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
        <CardContent className="prose max-w-none py-6">
          <div className="text-gray-700 leading-relaxed text-base prose max-w-none">
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
        <CardFooter className="justify-end border-t">
          <Button variant="beige" onClick={() => window.history.back()}>Back</Button>
        </CardFooter>
      </Card>
    );
  } 