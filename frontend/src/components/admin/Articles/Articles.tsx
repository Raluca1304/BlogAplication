import { useState, useEffect, JSX } from 'react';
import { NavLink } from 'react-router';
import { Post } from '../../../types';
import { DataTable } from './data-table';
import { articleColumns } from './columns';
import { CustomPagination } from '../Actions/CustomPagination';

export function Articles(): JSX.Element {
    const [articles, setArticles] = useState<Post[]>([]);

    useEffect(() => {
        fetch("/api/articles")
            .then(response => response.json())
            .then((data: Post[]) => {
                console.log("Articles data:", data);
                const sortedArticles = data.sort((a, b) => {
                    return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
                });
                setArticles(sortedArticles);
            })
            .catch((err) => console.error("Error fetching articles:", err));
    }, []);

    return (
        <div>
            <h1 className="text-xl font-semibold mb-2 mt-4">Articles</h1>

            <div className="flex items-center text-sm text-gray-600 mb-4 mt-5">  
                <NavLink 
                    to="/admin/dashboard" 
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                    Dashboard
                </NavLink>
                <span className="mx-2">{'>'}</span>
                <span className="text-gray-800">Manage Articles</span>
            </div>
            
            <DataTable
                data={articles}
                columns={articleColumns}
                filterColumn="title"
                pageSize={10}
                renderFooter={({ pageIndex, pageSize, pageCount, totalRows, setPageIndex, selectedRows, selectedCount }) => (
                    <div className="space-y-2">
                        {selectedCount > 0 && (
                            <div className="text-sm text-gray-600">
                                {selectedCount} of {totalRows} articles selected
                            </div>
                        )}
                        <CustomPagination
                            currentPage={pageIndex + 1}
                            totalItems={totalRows}
                            itemsPerPage={pageSize}
                            onPageChange={(p) => setPageIndex(p - 1)}
                            itemName="articles"
                        />
                    </div>
                )}
            />
        </div>
    );
} 
