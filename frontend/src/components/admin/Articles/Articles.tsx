import React, { useState, useEffect, JSX } from 'react';
import { NavLink } from "react-router";
import { Post } from '../../../types';
import { ActionButtonGroup } from '../Actions';
import { Button } from '@/components/ui/button';
import { 
    Pagination, 
    PaginationContent, 
    PaginationItem, 
    PaginationLink, 
    PaginationNext, 
    PaginationPrevious 
} from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Custom hook pentru logica de paginare
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

    // Reset page when data changes dramatically (like after delete)
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

// Componenta de paginare custom care folosește UI components
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
            <h2>Manage Articles</h2>
            < Button onClick={() => window.location.href = '/create'} variant="navy">Create Article</Button>
            <Table className="table-auto mt-4 border-collapse border-spacing-0 border border-gray-300 rounded-md shadow-md">
                <TableHeader className="bg-gray-100">   
                    <TableRow>
                        <TableHead className="border border-gray-300 p-4 text-center">ID</TableHead>
                        <TableHead className="border border-gray-300 p-4 text-center">Title</TableHead>
                        <TableHead className="border border-gray-300 p-4 text-center">Author</TableHead>
                        <TableHead className="border border-gray-300 p-4 text-center">Content Preview</TableHead>
                        <TableHead className="border border-gray-300 p-4 text-center">Created</TableHead>
                        <TableHead className="border border-gray-300 p-4 text-center">Updated</TableHead>
                        <TableHead className="border border-gray-300 p-4 text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentArticles.map((article) => (
                        <TableRow key={article.id}>
                            <TableCell className="border border-gray-300 p-4">
                                    {article.id}
                            </TableCell>
                            <TableCell className="border border-gray-300 p-4">
                                {article.title}
                            </TableCell>
                            <TableCell className="border border-gray-300 p-4">
                                {typeof article.author === 'string' ? article.author : article.author?.username ?? 'Unknown'}
                            </TableCell>
                            <TableCell className="border border-gray-300 p-4 max-w-[200px]">
                                {article.content.substring(0, 25)}...
                            </TableCell>
                            <TableCell className="border border-gray-300 p-4">
                                {formatDateTime(article.createdDate)}
                            </TableCell>
                            <TableCell className="border border-gray-300 p-4">
                                {formatDateTime(article.updatedDate || '')}
                            </TableCell>
                            <TableCell className="border border-gray-300 p-4 text-center">
                                <ActionButtonGroup
                                
                                    onEdit={() => handleEdit(article.id)}
                                    onDelete={() => handleDelete(article.id)}
                                    onView={() => handleView(article.id)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            

            <CustomPagination
                currentPage={currentPage}
                totalItems={articles.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                itemName="articles"
            />
        </div>
    );
} 
