import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { Comment } from '../../../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListFilter } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '../Articles/data-table';
import { commentColumns } from './columns';
import { CustomPagination } from '../Actions/CustomPagination';
import { formatDateTime } from '../utils/formatDataTime';


// Keep for legacy delete adjustments
function usePagination(itemsPerPage: number = 5) {
    const [currentPage, setCurrentPage] = React.useState(1);

    const adjustPageForDataLength = (dataLength: number) => {
        const totalPages = Math.ceil(dataLength / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    };

    return {
        adjustPageForDataLength
    };
}

export function Comments() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [articleFilter, setArticleFilter] = useState<string>('');
    const { adjustPageForDataLength } = usePagination(5);


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
        return <div className="text-red-500">Error: {error}</div>;
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

    // Extract unique article titles from comments
    const uniqueArticleTitles = Array.from(
        new Set(comments.map(comment => comment.article.title))
    ).sort();

    // Filter comments by the selected article title
    const filteredComments = comments.filter(comment => {
        if (!articleFilter.trim()) return true;
        return comment.article.title === articleFilter;
    });

    const handleFilterChange = (value: string | null) => {
        setArticleFilter(value || '');
    };

    const handleClearFilter = () => {
        setArticleFilter('');
    };

    return (
        <div>
            <h1 className="text-xl font-semibold mb-2 mt-4">Comments</h1>   
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center text-sm text-gray-600 mb-4 mt-5">
                <NavLink 
                    to="/admin/dashboard" 
                     className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                    Dashboard
                </NavLink>
                <span className="mx-2">{'>'}</span>
                <span className="text-gray-800">Manage Comments</span>
            </div>
            
            <DataTable
                data={filteredComments}
                columns={commentColumns}
                pageSize={10}
                customFilters={(globalFilter, setGlobalFilter) => (
                    <div className="flex items-center justify-between py-3 gap-4">
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Search comments..."
                                    value={globalFilter ?? ''}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="w-[280px]"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Select
                                    value={articleFilter}
                                    onValueChange={(value) => handleFilterChange(value || null)}
                                >
                                    <SelectTrigger className="w-[280px] border border-gray-300 rounded-md">
                                        <ListFilter className="h-4 w-4 opacity-60" />
                                        <SelectValue placeholder="Select an article" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Articles</SelectLabel>
                                            {uniqueArticleTitles.map((title, index) => (
                                                <SelectItem key={index} value={title}>
                                                    {title}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {articleFilter && (
                                    <Button onClick={handleClearFilter}>
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>
                )}
                renderFooter={({ pageIndex, pageSize, pageCount, totalRows, setPageIndex, selectedRows, selectedCount }) => (
                    <div className="space-y-2">
                        <CustomPagination
                            currentPage={pageIndex + 1}
                            totalItems={totalRows}
                            itemsPerPage={pageSize}
                            onPageChange={(p) => setPageIndex(p - 1)}
                            itemName={articleFilter ? `comments for "${articleFilter}"` : "comments"}
                        />
                    </div>
                )}
            />
            
            {/* Information about filtering */}
            {articleFilter && (
                <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredComments.length} of {comments.length} comments 
                    for article: "<strong>{articleFilter}</strong>"
                </div>
            )}
        </div>
    );
}
