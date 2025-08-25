import React from "react";
import { useParams, useNavigate, NavLink } from 'react-router';
import { ArticleForm } from "../admin/forms/ArticleForm";
import type { Post } from "../../types";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

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
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6 relative">
        <NavLink
          to="/public/posts"
          className="text-gray-800 hover:text-gray-400 transition-colors"
        >
          <ChevronLeft className="w-8 h-8" />
        </NavLink>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 bold font-extrabold text-3xl">
          {isAdmin ? 'Edit Article' : 'Edit My Article'}
        </h1>
        <div></div> {/* Empty div for balance */}
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