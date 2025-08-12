import React, { useState, useEffect } from 'react';
import { Comment } from '../../../types';
import { ActionButtonGroup } from '../Actions';
import { formatDateTime } from '../utils/formatDataTime';
import { Button } from '@/components/ui/button';
import { 
    Pagination, 
    PaginationContent, 
    PaginationItem, 
    PaginationLink, 
    PaginationNext, 
    PaginationPrevious 
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


function usePagination(itemsPerPage: number = 5) {
    const [currentPage, setCurrentPage] = React.useState(1);

    const getPaginatedData = (data: any[]) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const resetPage = () => setCurrentPage(1);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };


    const adjustPageForDataLength = (dataLength: number) => {
        const totalPages = Math.ceil(dataLength / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    };

    return {
        currentPage,
        itemsPerPage,
        getPaginatedData,
        handlePageChange,
        resetPage,
        adjustPageForDataLength
    };
}


function CustomPagination({ 
    currentPage, 
    totalItems, 
    itemsPerPage, 
    onPageChange, 
    itemName 
}: {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    itemName: string;
}) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    // Don't render pagination if there's only one page or no items
    if (totalPages <= 1) {
        return null;
    }

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-4 p-4">
            <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{endIndex} of {totalItems} {itemName}
            </div>
            
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious 
                            onClick={() => onPageChange(currentPage - 1)}
                            className={`${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        />
                    </PaginationItem>
                    
                    {getPageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                            {page === 'ellipsis' ? (
                                    <span className="px-2">...</span>
                            ) : (
                                <PaginationLink
                                    onClick={() => onPageChange(page as number)}
                                    isActive={currentPage === page}
                                    className="cursor-pointer min-w-10 text-center"
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                        <PaginationNext 
                            onClick={() => onPageChange(currentPage + 1)}
                                className={`${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}

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
        // Reset to the first page when the filter changes
        handlePageChange(1);
    };

    const handleClearFilter = () => {
        setArticleFilter('');
        handlePageChange(1);
    };

    // Apply pagination to the filtered comments
    const currentComments = getPaginatedData(filteredComments);

    return (
        <div>
            <h2>Comments</h2>
            
            <div className="mb-4 p-4 bg-gray-100 rounded-md border border-gray-300">
                <div className="flex items-center gap-2">
                    <p className="font-bold">
                        Filter by Article
                    </p>
                    <Select
                        value={articleFilter}
                        onValueChange={(value) => handleFilterChange(value || null)}
                    >
                        <SelectTrigger className="w-[280px]">
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
                        <Button
                            onClick={handleClearFilter} 
                        >
                            Clear
                        </Button>
                    )}
                </div>
                
                {/* Information about filtering */}
                {articleFilter && (
                    <div className="mt-2 text-sm text-gray-600">
                        Showing {filteredComments.length} of {comments.length} comments 
                        for article: "<strong>{articleFilter}</strong>"
                    </div>
                )}
            </div>

            {filteredComments.length === 0 ? (
                <div className="text-center p-4 text-gray-600">
                    {articleFilter ? 
                        `No comments found for article "${articleFilter}"` : 
                        'No comments found.'
                    }
                </div>
            ) : (
                <Table className="w-full border-collapse mt-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="border border-gray-300 p-3 text-center">ID</TableHead>
                            <TableHead className="border border-gray-300 p-3 text-center">Author</TableHead>
                            <TableHead className="border border-gray-300 p-3 text-center">Article</TableHead>
                            <TableHead className="border border-gray-300 p-3 text-center">Text</TableHead>
                            <TableHead className="border border-gray-300 p-3 text-center">Created</TableHead>
                            <TableHead className="border border-gray-300 p-3 text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentComments.map((comment) => (
                            <TableRow key={comment.id}>
                                <TableCell className="border border-gray-300 p-3">
                                    {comment.id}
                                </TableCell>
                                <TableCell className="border border-gray-300 p-3">
                                    {comment.authorName}
                                </TableCell>
                                        <TableCell className="border border-gray-300 p-3">
                                    {comment.article.title}
                                </TableCell>
                                <TableCell className="border border-gray-300 p-3 max-w-96">
                                    {comment.text.substring(0, 100)}{comment.text.length > 100 ? '...' : ''}
                                </TableCell>
                                <TableCell className="border border-gray-300 p-3">
                                    {formatDateTime(comment.createdDate)}
                                </TableCell>
                                <TableCell className="border border-gray-300 p-3 text-center">
                                    <ActionButtonGroup
                                        onEdit={() => handleEdit(comment.id)}
                                        onDelete={() => handleDelete(comment.id)}
                                        onView={() => handleView(comment.id)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            
            <CustomPagination
                currentPage={currentPage}
                totalItems={filteredComments.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                itemName={articleFilter ? `comments for "${articleFilter}"` : "comments"}
            />
        </div>
    );
}
