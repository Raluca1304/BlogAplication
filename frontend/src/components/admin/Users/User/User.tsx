import React, { useState, useEffect, JSX } from 'react';
import { useParams } from "react-router";
import { User as UserType } from '../../../../types';

export function User(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const token = localStorage.getItem('jwt');
            fetch(`/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    if (!res.ok) throw new Error('User not found');
                    return res.json();
                })
                .then((data: UserType) => {
                    setUser(data);
                })
                .catch((err) => {
                    setError(err.message);
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return (
            <div style={{ padding: '20px' }}>
                <p>Loading user...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px' }}>
                <h2>Error</h2>
                <p style={{ color: 'red' }}>{error}</p>
                <button onClick={() => window.location.href = '/admin/users'}>
                    Back to Users
                </button>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ padding: '20px' }}>
                <h2>User not found</h2>
                <button onClick={() => window.location.href = '/admin/users'}>
                    Back to Users
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>User Details</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => window.location.href = `/admin/users/${user.id}/edit`}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Edit User
                    </button>
                    <button
                        onClick={() => window.location.href = '/admin/users'}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Back to Users
                    </button>
                </div>
            </div>
            
            <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '20px', 
                borderRadius: '8px',
                border: '1px solid #dee2e6'
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <p><strong>ID:</strong> {user.id}</p>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>First Name:</strong> {user.firstName}</p>
                        <p><strong>Last Name:</strong> {user.lastName}</p>
                    </div>
                    <div>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> 
                            <span style={{
                                marginLeft: '10px',
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
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
