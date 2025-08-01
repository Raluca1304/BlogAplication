import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { ArticleForm } from '../../..';

export function CreateArticle() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const role: string | null = localStorage.getItem('role');
    const token: string | null = localStorage.getItem('jwt');
    
    if (!token && (role !== "ROLE_ADMIN" && role !== "ROLE_AUTHOR")) {
      alert("You do not have permission to create posts!");
      navigate('/login');
    }
  }, [navigate]);

  const handleSave = (article: any) => {
    alert("Successfully created article!");
    navigate('/admin/articles');
  };

  const handleCancel = () => {
    navigate('/admin/articles');
  };

  return (
    <ArticleForm 
      mode="create"
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
} 