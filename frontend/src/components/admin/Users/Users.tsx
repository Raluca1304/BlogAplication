import React, { useState, useEffect } from 'react';
import { User } from '../../../types';
import { ActionButtonGroup, Pagination, usePagination } from '../..';

const ROLES = ['ROLE_USER', 'ROLE_AUTHOR', 'ROLE_ADMIN'];

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

    }, []);

    const handleDelete = async (userId: string): Promise<void> => {
        const token: string | null = localStorage.getItem("jwt");
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        
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
            const res = await fetch(`/api/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'text/plain',
                    Authorization: `Bearer ${token}`
                },
                body: newRole
            });
            
            if (res.ok) {

                const updatedUsers = users.map(user => 
                    user.id === userId ? { ...user, role: newRole } : user
                );
                setUsers(updatedUsers);
                alert("Role updated successfully!");
            } else {
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

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRoleFilter(event.target.value);
        handlePageChange(1);
    };

    const handleClearFilter = () => {
        setRoleFilter('');
        handlePageChange(1);
    };

    const currentUsers = getPaginatedData(filteredUsers);

    if (loading) return <div style={{ padding: '20px' }}>Loading users...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

    return (
        <div>
            <h2>Manage Users</h2>
            
            {/* Secțiunea de filtrare */}
            <div style={{ 
                marginBottom: '20px', 
                padding: '15px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '5px',
                border: '1px solid #dee2e6'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label htmlFor="roleFilter" style={{ fontWeight: 'bold', minWidth: '120px' }}>
                        Filter by Role:
                    </label>
                    <select
                        id="roleFilter"
                        value={roleFilter}
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
                        <option value="">All Roles</option>
                        {ROLES.map((role) => (
                            <option key={role} value={role}>
                                {role.replace('ROLE_', '')}
                            </option>
                        ))}
                    </select>
                    {roleFilter && (
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
                
                {roleFilter && (
                    <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                        Showing {filteredUsers.length} of {users.length} users 
                        with role: "<strong>{roleFilter.replace('ROLE_', '')}</strong>"
                    </div>
                )}
            </div>

            {filteredUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    {roleFilter ? 
                        `No users found with role "${roleFilter.replace('ROLE_', '')}"` : 
                        'No users found.'
                    }
                </div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>ID</th>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Username</th>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Name</th>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Email</th>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Role</th>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Change Role</th>
                            <th style={{ border: '1px solid #ddd', padding: '20px', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user.id}>
                                <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                                    {user.id}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                                    {user.username}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                                    {user.firstName} {user.lastName}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                                    {user.email}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        backgroundColor: 
                                            user.role === 'ROLE_ADMIN' ? '#dc3545' :
                                            user.role === 'ROLE_AUTHOR' ? '#28a745' : '#007bff',
                                        color: 'white'
                                    }}>
                                        {user.role?.replace('ROLE_', '') || 'USER'}
                                    </span>
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>
                                    <select
                                        value={user.role || "ROLE_USER"}
                                        onChange={e => handleRoleChange(user.id, e.target.value)}
                                        disabled={user.role === "ROLE_ADMIN"}
                                        style={{
                                            padding: '4px 8px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            cursor: user.role === "ROLE_ADMIN" ? 'not-allowed' : 'pointer',
                                            backgroundColor: user.role === "ROLE_ADMIN" ? '#f5f5f5' : 'white'
                                        }}
                                    >
                                        {ROLES.map(role => (
                                            <option key={role} value={role}>
                                                {role.replace('ROLE_', '')}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>
                                    <ActionButtonGroup
                                        onEdit={() => handleEdit(user.id)}
                                        onDelete={() => handleDelete(user.id)}
                                        onView={() => handleView(user.id)}
                                        showDelete={user.role !== 'ROLE_ADMIN'}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
            <Pagination
                currentPage={currentPage}
                totalItems={filteredUsers.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                itemName={roleFilter ? `users with role "${roleFilter.replace('ROLE_', '')}"` : "users"}
            />
        </div>
    );
}
