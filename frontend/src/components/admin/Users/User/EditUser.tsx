import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { User } from '../../../../types';

const ROLES = ['ROLE_USER', 'ROLE_AUTHOR', 'ROLE_ADMIN'];

export function EditUser() {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('ROLE_USER');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
                .then((data: User) => {
                    setUser(data);
                    setUsername(data.username);
                    setFirstName(data.firstName);
                    setLastName(data.lastName);
                    setEmail(data.email);
                    setRole(data.role || 'ROLE_USER');
                })
                .catch((err) => {
                    setError(err.message);
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleSave = async () => {
        if (!firstName.trim() || !lastName.trim() || !email.trim()) {
            setError('First name, last name, and email are required');
            return;
        }

        setSaving(true);
        setError(null);
        const token = localStorage.getItem('jwt');

        try {
            const roleRes = await fetch(`/api/users/${id}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'text/plain',
                    Authorization: `Bearer ${token}`
                },
                body: role
            });

            if (!roleRes.ok) {
                throw new Error('Failed to update user role');
            }

            alert('User updated successfully!');
            window.location.href = `/admin/users/${id}`;
        } catch (err: any) {
            console.error('Error updating user:', err);
            setError(`Failed to update user: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        window.location.href = `/admin/users/${id}`;
    };

    if (loading) {
        return (
            <div style={{ padding: '20px' }}>
                <p>Loading user...</p>
            </div>
        );
    }

    if (error && !user) {
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
            <h2>Edit User: {user.username}</h2>
            
            <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '20px', 
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                marginBottom: '20px'
            }}>
                <p><strong>Note:</strong> Only role changes are supported!</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Username (read-only):
                </label>
                <input
                    type="text"
                    value={user.username}
                    disabled
                    style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: '#f5f5f5',
                        color: '#666'
                    }}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    First Name (read-only):
                </label>
                <input
                    type="text"
                    value={firstName}
                    disabled
                    style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: '#f5f5f5',
                        color: '#666'
                    }}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Last Name (read-only):
                </label>
                <input
                    type="text"
                    value={lastName}
                    disabled
                    style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: '#f5f5f5',
                        color: '#666'
                    }}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Email (read-only):
                </label>
                <input
                    type="email"
                    value={email}
                    disabled
                    style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: '#f5f5f5',
                        color: '#666'
                    }}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Role:
                </label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={saving || user.role === 'ROLE_ADMIN'}
                    style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: (saving || user.role === 'ROLE_ADMIN') ? '#f5f5f5' : 'white',
                        cursor: (saving || user.role === 'ROLE_ADMIN') ? 'not-allowed' : 'pointer'
                    }}
                >
                    {ROLES.map(roleOption => (
                        <option key={roleOption} value={roleOption}>
                            {roleOption.replace('ROLE_', '')}
                        </option>
                    ))}
                </select>
                {user.role === 'ROLE_ADMIN' && (
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        Admin role cannot be changed
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={handleSave}
                    disabled={saving || role === user.role || user.role === 'ROLE_ADMIN'}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: saving ? '#ccc' : (role === user.role || user.role === 'ROLE_ADMIN') ? '#ccc' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: saving ? 'not-allowed' : (role === user.role || user.role === 'ROLE_ADMIN') ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                    onClick={handleCancel}
                    disabled={saving}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    Cancel
                </button>
            </div>
            
            {error && (
                <div style={{
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    border: '1px solid #f5c6cb',
                    borderRadius: '4px'
                }}>
                    {error}
                </div>
            )}
        </div>
    );
}