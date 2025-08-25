import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { User } from '../../../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListFilter, Search } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '../Articles/data-table';
import { userColumns } from './columns';
import { CustomPagination } from '../Actions/CustomPagination';

const ROLES = ['ROLE_USER', 'ROLE_AUTHOR', 'ROLE_ADMIN'];

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

export function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [roleFilter, setRoleFilter] = useState<string>('');
    const { adjustPageForDataLength } = usePagination(5);


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
    };

    const handleClearFilter = () => {
        setRoleFilter('');
    };

    if (loading) return <div className="p-4">Loading users...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div>
            <h1 className="text-xl font-semibold mb-2 mt-4">Users</h1>
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center text-sm text-gray-600 mb-4 mt-5">
                <NavLink 
                    to="/admin/dashboard" 
                     className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                    Dashboard
                </NavLink>
                <span className="mx-2">{'>'}</span>
                <span className="text-gray-800">Manage Users</span>
            </div>
            
            <DataTable
                data={filteredUsers}
                columns={userColumns}
                filterColumn="username"
                pageSize={10}
                customFilters={(globalFilter, setGlobalFilter) => (
                    <div className="flex items-center justify-between py-3 gap-2">
                        {/* Search Username */}
                        <Input
                            placeholder="Search username..."
                            value={globalFilter ?? ''}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="max-w-sm"
                        />
                        
                        {/* Role Filter */}
                        <div className="flex items-center gap-2">
                            <Select
                                value={roleFilter}
                                onValueChange={(value) => handleFilterChange(value || null)}
                            >
                                <SelectTrigger className="w-[180px] border border-gray-300 rounded-md">
                                    <ListFilter className="h-4 w-4 mr-2" />
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
                                <Button onClick={handleClearFilter} size="sm">
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>
                )}
                renderFooter={({ pageIndex, pageSize, pageCount, totalRows, setPageIndex, selectedRows, selectedCount }) => (
                    <div className="space-y-2">
                        {selectedCount > 0 && (
                            <div className="text-sm text-gray-600">
                                {selectedCount} din {totalRows} users selected
                            </div>
                        )}
                        {roleFilter && (
                            <div className="text-sm text-gray-600 mb-2">
                                Showing {filteredUsers.length} of {users.length} users 
                                with role: "<strong>{roleFilter.replace('ROLE_', '')}</strong>"
                            </div>
                        )}
                        <CustomPagination
                            currentPage={pageIndex + 1}
                            totalItems={totalRows}
                            itemsPerPage={pageSize}
                            onPageChange={(p) => setPageIndex(p - 1)}
                            itemName={roleFilter ? `users with role "${roleFilter.replace('ROLE_', '')}"` : "users"}
                        />
                    </div>
                )}
            />
        </div>
    );
}
