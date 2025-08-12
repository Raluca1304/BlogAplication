import React, { useState, useEffect, JSX } from 'react';
import { useParams } from "react-router";
import { User as UserType } from '../../../../types';
import { Button } from '@/components/ui/button';

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
            <div className="p-4">
                <p>Loading user...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <h2>Error</h2>
                <p className="text-red-500">{error}</p>
                <Button variant="burgundy" onClick={() => window.location.href = '/admin/users'}>
                    Back to Users
                </Button>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-4">
                <h2>User not found</h2>
                <Button variant="burgundy" onClick={() => window.location.href = '/admin/users'}>
                    Back to Users
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2>User Details</h2>
                <div className="flex gap-2">
                    <Button
                        onClick={() => window.location.href = `/admin/users/${user.id}/edit`}
                        variant="yellow"
                    >
                        Edit User
                    </Button>
                    <Button
                        onClick={() => window.location.href = '/admin/users'}
                        variant="burgundy"
                    >
                        Back to Users
                    </Button>
                </div>
            </div>
            
            <div className="p-4 bg-gray-100 rounded-md border border-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p><strong>ID:</strong> {user.id}</p>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>First Name:</strong> {user.firstName}</p>
                        <p><strong>Last Name:</strong> {user.lastName}</p>
                    </div>
                    <div>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> 
                            <span className="ml-2 px-2 py-1 rounded-md text-sm font-bold bg-gray-200 text-gray-800">
                                {user.role?.replace('ROLE_', '') || 'USER'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
