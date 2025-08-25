import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { ArticleForm } from '../admin/forms/ArticleForm';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

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
        <div className="flex justify-between items-center mb-6 relative">
            <NavLink 
                to="/public/posts"
                className="text-gray-800 hover:text-gray-400 transition-colors"
            >
                <ChevronLeft className="w-8 h-8" />
            </NavLink>  
            <h1 className="absolute left-1/2 transform -translate-x-1/2 bold font-extrabold text-3xl">
                {isAdmin ? 'Create Article' : 'Create New Article'}
            </h1>
            <div></div> {/* Empty div for balance */}
        </div>
      </div>
      
      <ArticleForm 
        mode="create"
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}