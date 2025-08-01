import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    itemName: string;
}

export function Pagination({ 
    currentPage, 
    totalItems, 
    itemsPerPage, 
    onPageChange, 
    itemName 
}: PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const goToPrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const goToNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    // Don't render pagination if there's only one page or no items
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginTop: '20px',
            padding: '10px 0'
        }}>
            <div style={{ fontSize: '14px', color: '#666' }}>
                Showing {startIndex + 1}-{endIndex} of {totalItems} {itemName}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                    onClick={goToPrevious}
                    disabled={currentPage === 1}
                    style={{
                        padding: '8px 12px',
                        backgroundColor: currentPage === 1 ? '#f5f5f5' : '#007bff',
                        color: currentPage === 1 ? '#999' : 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                >
                    Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        style={{
                            padding: '8px 12px',
                            backgroundColor: currentPage === page ? '#007bff' : 'white',
                            color: currentPage === page ? 'white' : '#007bff',
                            border: '1px solid #007bff',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            minWidth: '40px'
                        }}
                    >
                        {page}
                    </button>
                ))}
                
                <button 
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                    style={{
                        padding: '8px 12px',
                        backgroundColor: currentPage === totalPages ? '#f5f5f5' : '#007bff',
                        color: currentPage === totalPages ? '#999' : 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                    }}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

// Custom hook pentru logica de paginare
export function usePagination(itemsPerPage: number = 5) {
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