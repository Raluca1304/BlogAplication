import React, { useState, useEffect, JSX } from 'react';
import { NavLink, useParams } from "react-router";
import { Post } from '../../../../types';

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
      <div className="article">
        <h2>{article.title}</h2>
        <p>{article.content}</p>
        <p>
          <small>{new Date(article.createdDate).toLocaleString()}</small>
        </p>
      </div>
    );
  } 