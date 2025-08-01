import React, { useState, useEffect } from 'react';
import { Comment } from '../../../types';
import { ActionButtonGroup, Pagination, usePagination } from '../..';

export function Comments() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [articleFilter, setArticleFilter] = useState<string>('');
    const { 
        currentPage, 
        itemsPerPage, 
        getPaginatedData, 
        handlePageChange, 
        adjustPageForDataLength 
    } = usePagination(5);

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

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        // GET all comments from the API
        fetch("/api/comments")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Received comments data:", data);
                if (Array.isArray(data)) {
                    setComments(data);
                } else {
                    console.error("Expected array but got:", typeof data, data);
                    setError("Invalid data format received from server");
                    setComments([]);
                }
            })
            .catch((err) => {
                console.error("Error fetching comments:", err);
                setError(err.message || "Failed to fetch comments");
                setComments([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading comments...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>Error: {error}</div>;
    }

    const handleDelete = async (commentId: string) => {
        const token: string | null = localStorage.getItem("jwt");
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            const res = await fetch(`/api/comments/${commentId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
                    if (res.ok) {
            const updatedComments = comments.filter(comment => comment.id !== commentId);
            setComments(updatedComments);
            adjustPageForDataLength(updatedComments.length);
        }
        } catch (err) {
            console.error("Error deleting comment:", err);
        }
    };

    const handleView = (commentId: string) => {     
        window.location.href = `/admin/comments/${commentId}`;
    };

    const handleEdit = (commentId: string) => {
        window.location.href = `/admin/comments/${commentId}/edit`;
    };

    // Extrage titlurile unice ale articolelor din comentarii
    const uniqueArticleTitles = Array.from(
        new Set(comments.map(comment => comment.article.title))
    ).sort();

    // Filtrare comentarii după titlul articolului selectat
    const filteredComments = comments.filter(comment => {
        if (!articleFilter.trim()) return true;
        return comment.article.title === articleFilter;
    });

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setArticleFilter(event.target.value);
        // Reset la prima pagină când se schimbă filtrul
        handlePageChange(1);
    };

    const handleClearFilter = () => {
        setArticleFilter('');
        handlePageChange(1);
    };

    // Aplică paginarea pe comentariile filtrate
    const currentComments = getPaginatedData(filteredComments);

    return (
        <div>
            <h2>Comments</h2>
            
            <div style={{ 
                marginBottom: '20px', 
                padding: '15px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '5px',
                border: '1px solid #dee2e6'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label htmlFor="articleFilter" style={{ fontWeight: 'bold', minWidth: '120px' }}>
                        Filter by Article:
                    </label>
                    <select
                        id="articleFilter"
                        value={articleFilter}
                        onChange={handleFilterChange}
                        style={{
                            flex: 1,
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            backgroundColor: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="">All Articles</option>
                        {uniqueArticleTitles.map((title, index) => (
                            <option key={index} value={title}>
                                {title}
                            </option>
                        ))}
                    </select>
                    {articleFilter && (
                        <button
                            onClick={handleClearFilter}
                            style={{
                                padding: '8px 12px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Clear
                        </button>
                    )}
                </div>
                
                {/* Informații despre filtrare */}
                {articleFilter && (
                    <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                        Showing {filteredComments.length} of {comments.length} comments 
                        for article: "<strong>{articleFilter}</strong>"
                    </div>
                )}
            </div>

            {filteredComments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    {articleFilter ? 
                        `No comments found for article "${articleFilter}"` : 
                        'No comments found.'
                    }
                </div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>ID</th>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Author</th>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Article</th>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Text</th>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Created</th>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentComments.map((comment) => (
                            <tr key={comment.id}>
                                <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                                    {comment.id}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                                    {comment.authorName}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                                    {comment.article.title}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '12px', maxWidth: '300px' }}>
                                    {comment.text.substring(0, 100)}{comment.text.length > 100 ? '...' : ''}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', fontSize: '14px' }}>
                                    {formatDateTime(comment.createdDate)}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>
                                    <ActionButtonGroup
                                        onEdit={() => handleEdit(comment.id)}
                                        onDelete={() => handleDelete(comment.id)}
                                        onView={() => handleView(comment.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
            <Pagination
                currentPage={currentPage}
                totalItems={filteredComments.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                itemName={articleFilter ? `comments for "${articleFilter}"` : "comments"}
            />
        </div>
    );
}
