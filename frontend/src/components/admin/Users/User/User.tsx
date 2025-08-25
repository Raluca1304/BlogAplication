import React, { useState, useEffect, JSX } from 'react';
import { useParams, NavLink } from "react-router";
import { User as UserType } from '../../../../types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';

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
        return <div className="p-4 text-center">Loading user...</div>;
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
        <div className="p-4 max-w-5xl mx-auto">
            {/* Back Navigation */}
            <div className="flex items-center text-sm text-gray-600 mb-4 mt-5">
                <NavLink to="/admin/users" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Back to All Users
                </NavLink>
            </div>

            <Card className="max-w-3xl mx-auto">
                <CardHeader className="border-b">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl">
                            User Details: {user.username}
                        </CardTitle>
                        <Button
                            onClick={() => window.location.href = `/admin/users/${user.id}/edit`}
                            variant="greenDark"
                        >
                            Edit User
                        </Button>
                    </div>
                </CardHeader>
                
                <CardContent className="p-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ID:
                            </label>
                            <div className="text-gray-900 font-mono text-sm">
                                {user.id}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username:
                            </label>
                            <div className="text-gray-900">
                                {user.username}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name:
                            </label>
                            <div className="text-gray-900">
                                {user.firstName}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name:
                            </label>
                            <div className="text-gray-900">
                                {user.lastName}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email:
                            </label>
                            <div className="text-gray-900">
                                {user.email}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role:
                            </label>
                            <div className="text-gray-900">
                                {user.role?.replace('ROLE_', '') || 'USER'}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
