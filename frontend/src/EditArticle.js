import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

export function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title || '');
        setContent(data.content || '');
      })
      .catch(() => setError('Could not load article.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const token = localStorage.getItem('jwt');
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
