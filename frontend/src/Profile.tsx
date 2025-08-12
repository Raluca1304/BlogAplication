import React, { useState, useEffect } from 'react';
import { User } from './types';
import { Button } from '@/components/ui/button';

export function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    setError('Not authenticated');
                    return;
                }

                const currentUsername = localStorage.getItem('username');
                
                console.log(currentUsername);

                if (!currentUsername) {
                    setError('No username found in session');
                    return;
                }

                
                const usersResponse = await fetch(`/api/users/${currentUsername}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (usersResponse.ok) {
                    const allUsers: User[] = await usersResponse.json();
                    
                    const currentUser = allUsers.find(u => u.username === currentUsername);
                    
                    if (currentUser) {
                        
                        setUser(currentUser);
                    } else {
                        
                        const userCaseInsensitive = allUsers.find(u => 
                            u.username?.toLowerCase() === currentUsername?.toLowerCase()
                        );
                        
                       
                    }
                } else {
                    setError('Failed to fetch user details');
                }
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('Error loading profile');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return (
            <div>
                <h2>Loading Profile...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div >
                <h2>Error</h2>
                <p className="text-red-500">{error}</p>
                <Button variant="burgundy" onClick={() => window.location.href = '/home'}>
                    Back to Home
                </Button>
            </div>
        );
    }

    if (!user) {
        return (
            <div>
                <h2>User not found</h2>
                <Button variant="burgundy" onClick={() => window.location.href = '/home'}>
                    Back to Home
                </Button>
            </div>
        );
    }

    return (
        <div>
            <div>
                <h1>My Profile</h1>
                <p>Your account information</p>
            </div>
            
            <div>
                <div>
                    <strong>User ID:</strong>
                    <div>
                        {user.id}
                    </div>
                </div>

                <div>
                    <strong>Username:</strong>
                    <div>
                        {user.username}
                    </div>
                </div>

                <div>
                    <strong>First Name:</strong>
                    <div>
                        {user.firstName}
                    </div>
                </div>

                <div>
                    <strong>Last Name:</strong>
                        <div>
                        {user.lastName}
                    </div>
                </div>

                <div>
                    <strong>Email:</strong>
                    <div>
                        {user.email}
                    </div>
                </div>

                <div>
                    <strong>Role:</strong>
                    <div>
                        <span>
                            {user.role?.replace('ROLE_', '') || 'USER'}
                        </span>
                    </div>
                </div>
            </div>

            <div>
                <h3>Account Actions</h3>
                <p>
                    Contact an administrator to modify your profile information
                </p>
                <Button
                    onClick={() => window.location.href = '/home'}
                    variant="burgundy"
                >
                    Back to Home
                </Button>
            </div>
        </div>
    );
}