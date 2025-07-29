import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

interface ArticleData {
  title: string;
  content: string;
}

export function EditArticle(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) {
      setError('Article ID is required');
      setLoading(false);
      return;
    }

    fetch(`/api/articles/${id}`)
      .then(res => res.json())
      .then((data: ArticleData) => {
        setTitle(data.title || '');
        setContent(data.content || '');
      })
      .catch(() => setError('Could not load article.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    
    if (!id) {
      setError('Article ID is required');
      return;
    }
    
    const token: string | null = localStorage.getItem('jwt');
    
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });
      
      if (res.ok) {
        navigate(`/posts/${id}`);
      } else {
        setError('Could not update article.');
      }
    } catch {
      setError('Could not update article.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-article">
      <h2>Edit Article</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
        </div>
        <button className="save-button">Save</button>
        {error && <p className="error-msg">{error}</p>}
      </form>
    </div>
  );
} 