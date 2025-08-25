import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, FormDataUser } from '../../../../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronLeft } from 'lucide-react';

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
    const [success, setSuccess] = useState<string | null>(null);

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
        setSuccess(null);
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

            setSuccess('User updated successfully!');
            // Redirect after a short delay to show success message
            setTimeout(() => {
                window.location.href = `/admin/users/${id}`;
            }, 1500);
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
        return <div className="p-4 text-center">Loading user...</div>;
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
                    <CardTitle className="text-2xl">
                        Edit User: {user.username}
                    </CardTitle>
                    <div className="mt-2 text-sm text-gray-600">
                        You can edit all user fields. Changes will be saved when you click "Save Changes".
                    </div>
                </CardHeader>
                
                <CardContent className="p-6">
                    {/* Success Alert */}
                    {success && (
                        <Alert variant="default" className="mb-6">
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username:
                            </label>
                            <Input 
                                type="text" 
                                placeholder="Enter username" 
                                {...register("username")} 
                                className="w-full"
                            />
                            {errors.username && (
                                <span className="text-red-500 text-sm mt-1 block">
                                    {errors.username.message}
                                </span>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name:
                            </label>
                            <Input 
                                type="text" 
                                placeholder="Enter first name" 
                                {...register("firstName")} 
                                className="w-full"
                            />
                            {errors.firstName && (
                                <span className="text-red-500 text-sm mt-1 block">
                                    {errors.firstName.message}
                                </span>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name:
                            </label>
                            <Input 
                                type="text" 
                                placeholder="Enter last name" 
                                {...register("lastName")} 
                                className="w-full"
                            />
                            {errors.lastName && (
                                <span className="text-red-500 text-sm mt-1 block">
                                    {errors.lastName.message}
                                </span>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email:
                            </label>
                            <Input 
                                type="email" 
                                placeholder="Enter email address" 
                                className="w-full"
                                {...register("email")} 
                            />
                            {errors.email && (
                                <span className="text-red-500 text-sm mt-1 block">
                                    {errors.email.message}
                                </span>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role:
                            </label>
                            <Select 
                                value={watchedValues.role}
                                onValueChange={(value) => setValue('role', value)}
                            >
                                <SelectTrigger className="w-full">
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
                                <span className="text-red-500 text-sm mt-1 block">
                                    {errors.role.message}
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-center justify-end gap-3 pt-4 border-t">
                            <Button 
                                type="button" 
                                onClick={handleCancel} 
                                disabled={saving}
                                variant="redDark"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={saving || !hasChanges}
                                variant="greenDark"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}