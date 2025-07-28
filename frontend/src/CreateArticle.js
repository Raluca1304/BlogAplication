import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router';

export function CreateArticle() {
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('jwt');
    const username = localStorage.getItem('username');
    console.log('Current user:', { username, role, token });
    if (!token && (role !== "ROLE_ADMIN" || role !== "ROLE_AUTHOR")) {
      alert("You do not have permission to create posts!");
      navigate('/login');
    }
  }, []);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt");
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
        setTitle();
        setContent();
      } else {
        setMessage("You are not authorized to create an article!");
      }
    } catch (err) {
      setMessage("Error creating article!");
    }
    if (!token && (role !== "ROLE_ADMIN" || role !== "ROLE_AUTHOR")) {
      setMessage("You are not authorized to create an articlea aici e eroarea!");
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
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Create</button>
      {message && <p>{message}</p>}
    </form>
  );
}
