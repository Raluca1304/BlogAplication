// import React from 'react';
// import { Button } from '@/components/ui/button';

// interface PaginationProps {
//     currentPage: number;
//     totalItems: number;
//     itemsPerPage: number;
//     onPageChange: (page: number) => void;
//     itemName: string;
// }

// export function Pagination({ 
//     currentPage, 
//     totalItems, 
//     itemsPerPage, 
//     onPageChange, 
//     itemName 
// }: PaginationProps) {
//     const totalPages = Math.ceil(totalItems / itemsPerPage);
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

//     const goToPrevious = () => {
//         if (currentPage > 1) {
//             onPageChange(currentPage - 1);
//         }
//     };

//     const goToNext = () => {
//         if (currentPage < totalPages) {
//             onPageChange(currentPage + 1);
//         }
//     };

//     // Don't render pagination if there's only one page or no items
//     if (totalPages <= 1) {
//         return null;
//     }

//     return (
//         <div style={{ 
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             alignItems: 'center', 
//             marginTop: '20px',
//             padding: '10px 0'
//         }}>
//             <div style={{ fontSize: '14px', color: '#666' }}>
//                 Showing {startIndex + 1}-{endIndex} of {totalItems} {itemName}
//             </div>
            
//             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                 <Button 
//                     onClick={goToPrevious}
//                     disabled={currentPage === 1}
//                     variant="outline"
//                 >
//                     Previous
//                 </Button>
                
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                     <Button
//                         key={page}
//                         onClick={() => onPageChange(page)}
//                         variant="outline"
//                     >
//                         {page}
//                     </Button>
//                 ))}
                
//                 <Button 
//                     onClick={goToNext}
//                     disabled={currentPage === totalPages}
//                     variant="outline"
//                 >
//                     Next
//                 </Button>
//             </div>
//         </div>
//     );
// }

// // Custom hook pentru logica de paginare
// export function usePagination(itemsPerPage: number = 5) {
//     const [currentPage, setCurrentPage] = React.useState(1);

//     const getPaginatedData = (data: any[]) => {
//         const startIndex = (currentPage - 1) * itemsPerPage;
//         const endIndex = startIndex + itemsPerPage;
//         return data.slice(startIndex, endIndex);
//     };

//     const resetPage = () => setCurrentPage(1);

//     const handlePageChange = (page: number) => {
//         setCurrentPage(page);
//     };

//     // Reset page when data changes dramatically (like after delete)
//     const adjustPageForDataLength = (dataLength: number) => {
//         const totalPages = Math.ceil(dataLength / itemsPerPage);
//         if (currentPage > totalPages && totalPages > 0) {
//             setCurrentPage(totalPages);
//         }
//     };

//     return {
//         currentPage,
//         itemsPerPage,
//         getPaginatedData,
//         handlePageChange,
//         resetPage,
//         adjustPageForDataLength
//     };
// }