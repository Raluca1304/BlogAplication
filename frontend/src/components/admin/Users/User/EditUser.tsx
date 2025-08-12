import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, FormDataUser } from '../../../../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
    } = useForm<FormDataUser>({
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

    const onSubmit = async (data: FormDataUser) => {
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

            <Alert variant="default">  
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>User updated successfully!</AlertDescription>
            </Alert>
            window.location.href = `/admin/users/${id}`;
        } catch (err: any) {
            console.error('Error updating user:', err);
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Failed to update user: {err.message}</AlertDescription>
            </Alert> 
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
            <div className="p-4">
                <h2>Error</h2>
                <p className="text-red-500">{error}</p>
                <Button variant="burgundy" onClick={() => window.location.href = '/admin/users'} className="mb-4">
                    Back to Users
                </Button>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-4">
                <h2>User not found</h2>
                <Button variant="burgundy" onClick={() => window.location.href = '/admin/users'} className="mb-4">
                    Back to Users
                </Button>
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
        <div className="p-4 max-w-2xl mx-auto">
            <h2>Edit User: {user.username}</h2>
            
            <div className="mb-4">
                <p><strong>Note:</strong> You can edit all user fields. Changes will be saved when you click "Save Changes".</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <Input 
                        type="text" 
                        placeholder="Username" 
                        {...register("username")} 
                        className="mb-4"
                    />
                    {errors.username && (
                        <span className="text-red-500 text-sm">
                            {errors.username.message}
                        </span>
                    )}
                </div>
                
                <div className="mb-4">
                    <Input 
                        type="text" 
                        placeholder="First name" 
                        {...register("firstName")} 
                        className="mb-4"
                    />
                    {errors.firstName && (
                        <span className="text-red-500 text-sm">
                            {errors.firstName.message}
                        </span>
                    )}
                </div>
                
                <div>
                    <Input 
                        type="text" 
                        placeholder="Last name" 
                        {...register("lastName")} 
                        className="mb-4"
                    />
                    {errors.lastName && (
                        <span className="text-red-500 text-sm">
                            {errors.lastName.message}
                        </span>
                    )}
                </div>
                
                <div>
                        <Input 
                        type="email" 
                        placeholder="Email" 
                        className="mb-4"
                        {...register("email")} 
                    />
                    {errors.email && (
                        <span className="text-red-500 text-sm">
                            {errors.email.message}
                        </span>
                    )}
                </div>
                
                <div>
                    <Select 
                        {...register("role")}
                    >
                        <SelectTrigger className="w-[120px] mb-4">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            {ROLES.map(role => (
                                <SelectItem key={role} value={role}>
                                    {role.replace('ROLE_', '')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.role && (
                        <span className="text-red-500 text-sm">
                            {errors.role.message}
                        </span>
                    )}
                </div>
                
                <div>
                    <Button 
                        type="submit" 
                        disabled={saving || !hasChanges}
                        variant="greenDark"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button 
                        type="button" 
                        onClick={handleCancel} 
                        disabled={saving}
                        variant="redDark"
                        className="ml-4"
                    >
                        Cancel
                    </Button>
                </div>
                
                {error && (
                    <div className="text-red-500 mt-4 p-2 bg-red-50 border border-red-200 rounded">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}