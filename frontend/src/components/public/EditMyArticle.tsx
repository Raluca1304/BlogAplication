import React from "react";
import { useParams, useNavigate } from 'react-router';
import { ArticleForm } from "../admin/forms/ArticleForm";
import type { Post } from "../../types";
import { Button } from "@/components/ui/button";

export function EditMyArticle(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('username');

  const handleSave = (article: Post) => {
    alert("Article updated successfully!");
    const role: string | null = localStorage.getItem('role');
    
    // Redirect based on user role
    if (role === 'ROLE_ADMIN') {
      navigate('/admin/articles');
    } else {
      navigate(`/public/users/${currentUser}`);
    }
  };

  const handleCancel = () => {
    const role: string | null = localStorage.getItem('role');
    
    // Go back based on user role
    if (role === 'ROLE_ADMIN') {
      navigate('/admin/articles');
    } else {
      navigate(`/public/users/${currentUser}`);
    }
  };

  if (!id) {
    return (
      <div className="p-4">
        <h2>Error</h2>
        <p>Article ID is required</p>
        <Button onClick={handleCancel} variant="outline">Go Back</Button>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-4">
        <h2>Error</h2>
        <p>You must be logged in to edit articles</p>
        <Button onClick={() => navigate('/login')} variant="outline">Login</Button>
      </div>
    );
  }

  const role: string | null = localStorage.getItem('role');
  const isAdmin = role === 'ROLE_ADMIN';

  return (
    <div>
      <div className="p-4 max-w-5xl mx-auto">
        <div className="mb-4">
          <Button variant="burgundy" onClick={handleCancel}>
            {isAdmin ? '← Back to Admin Articles' : '← Back to My Articles'}
          </Button>
        </div>
        <h1 className="text-2xl font-bold mb-4">{isAdmin ? 'Edit Article' : 'Edit My Article'}</h1>
      </div>
      
      <ArticleForm 
        articleId={id}
        mode="edit"
        onSave={(article) => handleSave(article as Post)}
        onCancel={handleCancel}
      />
    </div>
  );
}