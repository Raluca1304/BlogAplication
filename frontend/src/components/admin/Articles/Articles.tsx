import React, { useState, useEffect, JSX } from 'react';
import { NavLink } from "react-router";
import { Post } from '../../../types';
import { ActionButtonGroup, Pagination, usePagination } from '../..';

export function Articles(): JSX.Element {
    const [articles, setArticles] = useState<Post[]>([]);
    const { 
        currentPage, 
        itemsPerPage, 
        getPaginatedData, 
        handlePageChange, 
        adjustPageForDataLength 
    } = usePagination(5);


    // Format the date and time in a readable format
    const formatDateTime = (dateString: string) => {
        if (!dateString) return 'N/A';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid';
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    // Fetch the articles from the API
    useEffect(() => {
        // GET all articles from the API
        fetch("/api/articles")
            .then(response => response.json())
            .then((data: Post[]) => {
                console.log("Articles data:", data); 
                setArticles(data);
            })
            .catch((err) => console.error("Error fetching articles:", err));
    }, []);

    const handleEdit = (articleId: string) => {
        window.location.href = `/admin/articles/${articleId}/edit`;
    };

    const handleDelete = async (articleId: string): Promise<void> => {
        const token: string | null = localStorage.getItem("jwt");
        if (!window.confirm("Are you sure you want to delete this article?")) return;
        
        try {
          const res = await fetch(`/api/articles/${articleId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });
          
            if (res.ok) {
             const updatedArticles = articles.filter(article => article.id !== articleId);
             setArticles(updatedArticles);
             adjustPageForDataLength(updatedArticles.length);
             alert("Article deleted successfully!");
           } else {
            alert("You are not allowed to delete this article!");
          }
        } catch (err) {
          alert("Error deleting article!");
        }
      };

      const handleView = (articleId: string) => {
        window.location.href = `/admin/articles/${articleId}`;
      };

    const currentArticles = getPaginatedData(articles);

    return (
        <div>
            <h2>Manage Articles
            <button onClick={() => window.location.href = '/create'} style={{ marginTop: '20px' , marginLeft: '1200px'}}>Create Article</button>
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>ID</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Title</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Author</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Content Preview</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center'}}>Created</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center'}}>Updated</th>
                        <th style={{ border: '1px solid #ddd', padding: '20px', textAlign: 'center' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentArticles.map((article) => (
                        <tr key={article.id}>
                            <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                                    {article.id}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                                {article.title}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                                {typeof article.author === 'string' ? article.author : article.author?.username ?? 'Unknown'}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '12px', maxWidth: '300px' }}>
                                {article.content.substring(0, 100)}...
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', fontSize: '14px' }}>
                                {formatDateTime(article.createdDate)}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', fontSize: '14px' }}>
                                {formatDateTime(article.updatedDate || '')}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>
                                <ActionButtonGroup
                                    onEdit={() => handleEdit(article.id)}
                                    onDelete={() => handleDelete(article.id)}
                                    onView={() => handleView(article.id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            

            <Pagination
                currentPage={currentPage}
                totalItems={articles.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                itemName="articles"
            />
        </div>
    );
} 
