import React, { useState, useEffect } from 'react';
import { User } from '../../../types';
import { ActionButtonGroup } from '../Actions';
// import { Pagination, usePagination } from '../Actions';
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

const ROLES = ['ROLE_USER', 'ROLE_AUTHOR', 'ROLE_ADMIN'];

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
        <div
        className="flex flex-col items-center gap-4 mt-4 p-4">
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

export function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [roleFilter, setRoleFilter] = useState<string>('');
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
        
        const token = localStorage.getItem('jwt');
        fetch('/api/users', {
            headers: { Authorization: `Bearer ${token}` }
            
        })
            .then(res => {
                if (!res.ok) throw new Error('Not authorized or error fetching users');
                return res.json();
            })
            .then((data: User[]) => {
                console.log("Users data:", data);
                setUsers(data);
            })
            .catch((err) => {
                console.error("Error fetching users:", err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
            console.log("Users data:", users);
    }, []);

    const handleDelete = async (userId: string): Promise<void> => {
        const token  = localStorage.getItem("jwt");
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        console.log("Token:", token);
        console.log("User ID:", userId);

        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (res.ok) {
                const updatedUsers = users.filter(user => user.id !== userId);
                setUsers(updatedUsers);
                adjustPageForDataLength(updatedUsers.length);
                alert("User deleted successfully!");
            } else {
                alert("You are not allowed to delete this user!");
            }
        } catch (err) {
            alert("Error deleting user!");
        }
    };

    const handleView = (userId: string) => {
        window.location.href = `/admin/users/${userId}`;
    };

    const handleEdit = (userId: string) => {
        window.location.href = `/admin/users/${userId}/edit`;
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        const token: string | null = localStorage.getItem('jwt');
        
        if (!window.confirm(`Are you sure you want to change role to ${newRole}?`)) return;
        
        try {
            // First get the current user data
            const userRes = await fetch(`/api/users/${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (!userRes.ok) {
                alert("Failed to get user data!");
                return;
            }
            
            const userData = await userRes.json();
            
            // Now update with the new role
            const updateRes = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    username: userData.username,
                    email: userData.email,
                    password: userData.password || '',
                    role: newRole
                })
            });
            
            if (updateRes.ok) {
                const updatedUsers = users.map(user => 
                    user.id === userId ? { ...user, role: newRole } : user
                );
                setUsers(updatedUsers);
                alert("Role updated successfully!");
            } else {
                const errorText = await updateRes.text();
                console.error("Update failed:", errorText);
                alert("Failed to update role!");
            }
        } catch (err) {
            console.error("Error updating role:", err);
            alert("Error updating role!");
        }
    };

    // Filtrare utilizatori după rol
    const filteredUsers = users.filter(user => {
        if (!roleFilter.trim()) return true;
        return user.role === roleFilter;
    });

    const handleFilterChange = (value: string | null) => {
        setRoleFilter(value || '');
        handlePageChange(1);
    };

    const handleClearFilter = () => {
        setRoleFilter('');
        handlePageChange(1);
    };

    const currentUsers = getPaginatedData(filteredUsers);

    if (loading) return <div className="p-4">Loading users...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div>
            <h2>Manage Users</h2>
            
            {/* Secțiunea de filtrare */}
            <div
            className="mb-4 p-4 bg-gray-100 rounded-md"
            >
                <div className="flex items-center gap-4">
                    <p className="font-bold">
                        Filter by Role
                    </p>
                    <Select
                        value={roleFilter}
                        onValueChange={(value) => handleFilterChange(value || null)}
                    >
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Roles</SelectLabel>
                       
                        {ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                                {role.replace('ROLE_', '')}
                            </SelectItem>
                        ))}
                        </SelectGroup>
                    </SelectContent>
                    </Select>
                    {roleFilter && (
                        <Button
                            onClick={handleClearFilter}>
                            Clear
                        </Button>
                    )}
                </div>
                
                {roleFilter && (
                    <div className="mt-2 text-sm text-gray-600">
                        Showing {filteredUsers.length} of {users.length} users 
                        with role: "<strong>{roleFilter.replace('ROLE_', '')}</strong>"
                    </div>
                )}
            </div>

            {filteredUsers.length === 0 ? (
                <div className="text-center p-4 text-gray-600">
                    {roleFilter ? 
                        `No users found with role "${roleFilter.replace('ROLE_', '')}"` : 
                        'No users found.'
                    }
                </div>
            ) : (
                <Table className="w-full border-collapse mt-4">
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead className="border border-gray-300 p-3 text-center">ID</TableHead>
                            <TableHead className="border border-gray-300 p-3 text-center">Username</TableHead>
                            <TableHead className="border border-gray-300 p-3 text-center">First name</TableHead>
                            <TableHead className="border border-gray-300 p-3 text-center">Last name</TableHead>
                            <TableHead className="border border-gray-300 p-3 text-center">Email</TableHead>
                            <TableHead className="border border-gray-300 p-3 text-center">Role</TableHead>
                            <TableHead className="border border-gray-300 p-3 text-center">Change Role</TableHead>
                            <TableHead className="border border-gray-300 p-3 text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="border border-gray-300 p-3">
                                    {user.id}
                                </TableCell>
                                <TableCell className="border border-gray-300 p-3">
                                     {/* aici am lastname care de fapt este username */}
                                    {user.username}
                                    </TableCell>
                                <TableCell className="border border-gray-300 p-3">
                                    {/* aici am username care de fapt este firstName */}
                                    {user.firstName} 
                                </TableCell>
                                <TableCell className="border border-gray-300 p-3">
                                    {/* aici am firstName care de fapt este lastName */}
                                    {user.lastName}
                                </TableCell>
                                    <TableCell className="border border-gray-300 p-3">
                                    {user.email}
                                </TableCell>
                                <TableCell className="border border-gray-300 p-3">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-md`}>
                                        {user.role?.replace('ROLE_', '') || 'USER'}
                                    </span>
                                </TableCell>
                                <TableCell className="border border-gray-300 p-3 text-center">
                                    <Select
                                        value={user.role || "ROLE_USER"}
                                        onValueChange={e => handleRoleChange(user.id, e || 'ROLE_USER')}
                                        disabled={user.role === "ROLE_ADMIN"}
                                    >
                                        <SelectTrigger className="w-[100px]">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                            <SelectContent>
                                            {ROLES.map(role => (
                                                <SelectItem key={role} value={role}>
                                                    {role.replace('ROLE_', '')}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                </TableCell>
                                <TableCell className="border border-gray-300 p-3 text-center">
                                    <ActionButtonGroup
                                        onEdit={() => handleEdit(user.id)}
                                        onDelete={() => handleDelete(user.id)}
                                        onView={() => handleView(user.id)}
                                        showDelete={user.role !== 'ROLE_ADMIN'}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            
            <CustomPagination
                currentPage={currentPage}
                totalItems={filteredUsers.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                itemName={roleFilter ? `users with role "${roleFilter.replace('ROLE_', '')}"` : "users"}
            />
        </div>
    );
}
