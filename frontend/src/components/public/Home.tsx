import React, { JSX, useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { Article } from '../../types';
import { Button } from '@/components/ui/button';
import { getInitials } from '../admin/utils/formatDataTime';



export function Home(): JSX.Element {
  const [latest, setLatest] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/articles/latest?limit=4')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load latest articles');
        return res.json();
      })
      .then((data: Article[]) => setLatest(data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Our Blog</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Discover amazing articles, stories, and insights from our community of writers. Explore the latest posts and join the conversation!
      </p>

      <h2 className="text-2xl font-semibold mb-4">Latest posts</h2>

      {loading && (
        <div className="p-4 text-center">Loading latest posts...</div>
      )}

      {error && (
        <div className="p-4 text-center text-red-500">{error}</div>
      )}

      {!loading && !error && latest.length === 0 && (
        <div className="p-4 text-center text-gray-600">No posts yet.</div>
      )}

      <div className="flex flex-col gap-4">
        {latest.map((article) => (
          <div
            key={article.id}
            className="p-4 bg-white rounded-md border border-gray-300 transition-all duration-200"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            
            <h3 className="mb-3 text-xl font-semibold flex items-center gap-2">
              <Button
                variant="newRounded"
                title="View Profile"
              >
                {getInitials(article.author)}
              </Button>
              {article.title}
            </h3>
            
            <p className="mb-4 text-gray-700">{article.summary}</p>
            <Button variant="navy">
              <NavLink to={`/public/posts/${article.id}`}>Read Full Article →</NavLink>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}