import React, { useState, useEffect, JSX } from 'react';
import { NavLink, useParams } from "react-router";
import { User, Article } from '../../types';
import { Button } from '@/components/ui/button';

export function UsersPosts(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [articles, setArticles] = useState<Article[]>([]);
    const [userAuthor, setUserAuthor] = useState<string>("");
    const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  
    useEffect(() => {
        if (!id) return;
        
        const token: string | null = localStorage.getItem("jwt");
        
        // Create fetch options
        const fetchOptions: RequestInit = token 
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {};

        fetch(`/api/articles?authorId=${id}`, fetchOptions)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch articles');
            return res.json();
        })
        .then((data: Article[]) => setArticles(data))
        .catch(err => console.error("Error fetching articles: ", err));
  
        // Fetch user info - should work for everyone  
        fetch(`/api/users/${id}`, fetchOptions)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch user');
            return res.json();
        })
        .then((user: User) => {
          if (user && user.firstName && user.lastName) {
            setUserAuthor(`${user.firstName} ${user.lastName}`);
          } else {
            setUserAuthor("Unknown Author");
          }
        })
        .catch(err => console.error("Error fetching user: ", err));
    }, [id]);
  
    const filteredArticles: Article[] = selectedAuthor
      ? articles.filter(a => a.author === selectedAuthor)
      : articles;
  
    const currentUser: string | null = localStorage.getItem("username");
    const isLoggedIn = !!localStorage.getItem("jwt");

    const handleDelete = async (articleId: string): Promise<void> => {
      const token: string | null = localStorage.getItem("jwt");
      if (!token) {
        alert("You need to be logged in to delete articles!");
        return;
      }
      
      if (!window.confirm("Are you sure you want to delete this article?")) return;
      
      try {
        const res = await fetch(`/api/articles/${articleId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setArticles(articles.filter(a => a.id !== articleId));
          alert("Article deleted successfully!");
        } else {
          alert("You are not allowed to delete this article!");
        }
      } catch (err) {
        alert("Error deleting article!");
      }
    };
  
    return (
        <div  className="p-4 max-w-2xl mx-auto mt-10">
            <div className="mb-4">
                <Button variant="burgundy" className="mr-2">   
                    <NavLink 
                        to={`/public/posts`}>
                        ← Back to All Posts
                    </NavLink>
                </Button>
            </div>
            
            <h2 className="mb-4 text-2xl font-bold text-center">
                {userAuthor ? `${userAuthor}'s Blog` : 'Loading Author...'}
            </h2>
            
            {Array.isArray(filteredArticles) && filteredArticles.length > 0 ? (
                <div>
                    {filteredArticles.map((article) => (
                        <div 
                            key={article.id}
                            className="mb-4 p-4 border border-gray-300 rounded-md shadow-md"
                        >
                            <h3 className="text-lg font-semibold mb-2">
                                {article.title}
                            </h3>

                            <div className="flex justify-between items-center mb-2">
                               
                                <span>{new Date(article.createdDate).toLocaleDateString()}</span>
                            </div>

                            <p className="mb-4 text-gray-600 text-sm">
                                {article.summary}
                            </p>

                            <div
                            className="flex justify-between items-center gap-4">
                                <Button variant="navy">
                                    <NavLink 
                                        to={`/public/posts/${article.id}`}>
                                        Read Full Article →
                                    </NavLink>
                                    </Button>
                                {isLoggedIn && article.author === currentUser && (
                                    <Button
                                        onClick={() => handleDelete(article.id)}
                                        variant="redDark"
                                    >
                                        Delete
                                    </Button> 
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-4 bg-gray-100 rounded-md">
                    {userAuthor ? 
                        `${userAuthor} hasn't published any articles yet.` : 
                        'No articles found for this author.'
                    }
                </div>
            )}
        </div>
    );
  } 