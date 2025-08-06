import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User } from '../../../../types';

const ROLES = ['ROLE_USER', 'ROLE_AUTHOR', 'ROLE_ADMIN'];

const schema = yup
  .object({
    username: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
    firstName: yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
    lastName: yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
    email: yup.string().required('Email is required').email('Please enter a valid email'),
    role: yup.string().required('Role is required').oneOf(ROLES, 'Please select a valid role')
  })
  .required();

interface FormData {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export function EditUser() {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { 
        register, 
        handleSubmit, 
        formState: { errors }, 
        setValue,
        watch 
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            role: 'ROLE_USER'
        }
    });

    const watchedValues = watch();

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
                    setValue('username', data.username);
                    setValue('firstName', data.firstName);
                    setValue('lastName', data.lastName);
                    setValue('email', data.email);
                    setValue('role', data.role || 'ROLE_USER');
                })
                .catch((err) => {
                    setError(err.message);
                })
                .finally(() => setLoading(false));
        }
    }, [id, setValue]);

    const onSubmit = async (data: FormData) => {
        setSaving(true);
        setError(null);
        const token = localStorage.getItem('jwt');

        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
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
        return <div>Loading user...</div>;
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

    const hasChanges = user && (
        watchedValues.username !== user.username ||
        watchedValues.firstName !== user.firstName ||
        watchedValues.lastName !== user.lastName ||
        watchedValues.email !== user.email ||
        watchedValues.role !== user.role
    );

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
                <p><strong>Note:</strong> You can edit all user fields. Changes will be saved when you click "Save Changes".</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ marginBottom: '20px' }}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        {...register("username")} 
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: errors.username ? '1px solid #dc3545' : '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '16px',
                            marginBottom: '5px'
                        }}
                    />
                    {errors.username && (
                        <span style={{ color: '#dc3545', fontSize: '14px' }}>
                            {errors.username.message}
                        </span>
                    )}
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                    <input 
                        type="text" 
                        placeholder="First name" 
                        {...register("firstName")} 
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: errors.firstName ? '1px solid #dc3545' : '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '16px',
                            marginBottom: '5px'
                        }}
                    />
                    {errors.firstName && (
                        <span style={{ color: '#dc3545', fontSize: '14px' }}>
                            {errors.firstName.message}
                        </span>
                    )}
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                    <input 
                        type="text" 
                        placeholder="Last name" 
                        {...register("lastName")} 
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: errors.lastName ? '1px solid #dc3545' : '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '16px',
                            marginBottom: '5px'
                        }}
                    />
                    {errors.lastName && (
                        <span style={{ color: '#dc3545', fontSize: '14px' }}>
                            {errors.lastName.message}
                        </span>
                    )}
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        {...register("email")} 
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: errors.email ? '1px solid #dc3545' : '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '16px',
                            marginBottom: '5px'
                        }}
                    />
                    {errors.email && (
                        <span style={{ color: '#dc3545', fontSize: '14px' }}>
                            {errors.email.message}
                        </span>
                    )}
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                    <select 
                        {...register("role")}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: errors.role ? '1px solid #dc3545' : '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '16px',
                            marginBottom: '5px',
                            backgroundColor: 'white'
                        }}
                    >
                        {ROLES.map(roleOption => (
                            <option key={roleOption} value={roleOption}>
                                {roleOption.replace('ROLE_', '')}
                            </option>
                        ))}
                    </select>
                    {errors.role && (
                        <span style={{ color: '#dc3545', fontSize: '14px' }}>
                            {errors.role.message}
                        </span>
                    )}
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                    <button 
                        type="submit" 
                        disabled={saving || !hasChanges}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: saving || !hasChanges ? '#ccc' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: saving || !hasChanges ? 'not-allowed' : 'pointer',
                            fontSize: '16px',
                            fontWeight: '500'
                        }}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                        type="button" 
                        onClick={handleCancel} 
                        disabled={saving}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            fontSize: '16px',
                            fontWeight: '500'
                        }}
                    >
                        Cancel
                    </button>
                </div>
                
                {error && (
                    <div style={{ 
                        color: 'red', 
                        marginTop: '15px',
                        padding: '10px',
                        backgroundColor: '#f8d7da',
                        border: '1px solid #f5c6cb',
                        borderRadius: '4px'
                    }}>
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}