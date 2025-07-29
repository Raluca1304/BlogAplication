import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router';

interface CreateArticleResponse {
  success: boolean;
  message?: string;
}

export function CreateArticle(): JSX.Element {
  const navigate = useNavigate();
  
  useEffect(() => {
    const role: string | null = localStorage.getItem('role');
    const token: string | null = localStorage.getItem('jwt');
    const username: string | null = localStorage.getItem('username');
    console.log('Current user:', { username, role, token });
    
    if (!token && (role !== "ROLE_ADMIN" && role !== "ROLE_AUTHOR")) {
      alert("You do not have permission to create posts!");
      navigate('/login');
    }
  }, [navigate]);

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const token: string | null = localStorage.getItem("jwt");
    const role: string | null = localStorage.getItem('role');
    
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      
      if (res.ok) {
        setMessage("Successfully created article!");
        setTitle("");
        setContent("");
      } else {
        setMessage("You are not authorized to create an article!");
      }
    } catch (err) {
      setMessage("Error creating article!");
    }
    
    if (!token && (role !== "ROLE_ADMIN" && role !== "ROLE_AUTHOR")) {
      setMessage("You are not authorized to create an article!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-article-form">
      <h2>Create new article</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">Create</button>
      {message && <p>{message}</p>}
    </form>
  );
} 