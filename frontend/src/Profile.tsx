import React, { useState, useEffect } from 'react';
import { User } from './types';

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

                // Fetch all users and find current user by username
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
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Loading Profile...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px' }}>
                <h2>Error</h2>
                <p style={{ color: 'red' }}>{error}</p>
                <button onClick={() => window.location.href = '/home'}>
                    Back to Home
                </button>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ padding: '20px' }}>
                <h2>User not found</h2>
                <button onClick={() => window.location.href = '/home'}>
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1>My Profile</h1>
                <p style={{ color: '#666' }}>Your account information</p>
            </div>
            
            <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '30px', 
                borderRadius: '8px',
                border: '1px solid #dee2e6'
            }}>
                <div style={{ marginBottom: '20px' }}>
                    <strong>User ID:</strong>
                    <div style={{ 
                        marginTop: '5px', 
                        padding: '8px', 
                        backgroundColor: 'white', 
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontFamily: 'monospace'
                    }}>
                        {user.id}
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <strong>Username:</strong>
                    <div style={{ 
                        marginTop: '5px', 
                        padding: '8px', 
                        backgroundColor: 'white', 
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                    }}>
                        {user.username}
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <strong>First Name:</strong>
                    <div style={{ 
                        marginTop: '5px', 
                        padding: '8px', 
                        backgroundColor: 'white', 
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                    }}>
                        {user.firstName}
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <strong>Last Name:</strong>
                    <div style={{ 
                        marginTop: '5px', 
                        padding: '8px', 
                        backgroundColor: 'white', 
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                    }}>
                        {user.lastName}
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <strong>Email:</strong>
                    <div style={{ 
                        marginTop: '5px', 
                        padding: '8px', 
                        backgroundColor: 'white', 
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                    }}>
                        {user.email}
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <strong>Role:</strong>
                    <div style={{ marginTop: '5px' }}>
                        <span style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            backgroundColor: 
                                user.role === 'ROLE_ADMIN' ? '#dc3545' :
                                user.role === 'ROLE_AUTHOR' ? '#28a745' : '#007bff',
                            color: 'white'
                        }}>
                            {user.role?.replace('ROLE_', '') || 'USER'}
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ 
                marginTop: '30px', 
                textAlign: 'center',
                padding: '20px',
                backgroundColor: '#e9ecef',
                borderRadius: '8px'
            }}>
                <h3 style={{ marginBottom: '10px' }}>Account Actions</h3>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                    Contact an administrator to modify your profile information
                </p>
                <button
                    onClick={() => window.location.href = '/home'}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}