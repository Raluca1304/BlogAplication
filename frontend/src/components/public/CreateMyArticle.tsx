import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { ArticleForm } from '../admin/forms/ArticleForm';
import { Button } from "@/components/ui/button";

export function CreateMyArticle() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('username');
  
  useEffect(() => {
    const role: string | null = localStorage.getItem('role');
    const token: string | null = localStorage.getItem('jwt');
    
    if (!token || (role !== "ROLE_ADMIN" && role !== "ROLE_AUTHOR")) {
      alert("You do not have permission to create posts!");
      navigate('/login');
    }
  }, [navigate]);

  const handleSave = (article: any) => {
    alert("Successfully created article!");
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

  if (!currentUser) {
    return (
      <div className="p-4">
        <h2>Error</h2>
        <p>You must be logged in to create articles</p>
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
        <h1 className="text-2xl font-bold mb-4">Create New Article</h1>
      </div>
      
      <ArticleForm 
        mode="create"
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}