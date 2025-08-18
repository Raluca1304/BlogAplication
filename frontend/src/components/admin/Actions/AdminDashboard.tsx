import React, { useState, useEffect } from 'react';
import { roleUtils, DashboardStats } from '../../../types';

export function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        articlesCount: 0,
        commentsCount: 0,
        usersCount: 0
    });
    const [loading, setLoading] = useState(true);
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('jwt');
                const headers = { Authorization: `Bearer ${token}` };

                // Fetch all stats in parallel
                const [articlesRes, commentsRes, usersRes] = await Promise.all([
                    fetch('/api/articles', { headers }),
                    fetch('/api/comments', { headers }),
                    fetch('/api/users', { headers })
                ]);

                const [articles, comments, users] = await Promise.all([
                    articlesRes.ok ? articlesRes.json() : [],
                    commentsRes.ok ? commentsRes.json() : [],
                    usersRes.ok ? usersRes.json() : []
                ]);

                setStats({
                    articlesCount: articles.length || 0,
                    commentsCount: comments.length || 0,
                    usersCount: users.length || 0
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const dashboardCards = [
        {
            title: "Manage Articles",
            description: "Create, edit, view and delete articles",
            count: stats.articlesCount,
            link: "/admin/articles",
            visible: true
        },
        {
            title: "Manage Comments",
            description: "Moderate, edit and delete comments",
            count: stats.commentsCount,
            link: "/admin/comments",
            visible: true
        },
        {
            title: "Manage Users",
            description: "View, edit roles and manage user accounts",
            count: stats.usersCount,
            link: "/admin/users",
            visible: roleUtils.canManageUsers(role)
        }
    ];

    if (loading) {
        return <div >Loading...</div>;
    }

    return (
        <div >
            <div className="text-center">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome to the administration panel!  Manage your blog content and users.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 mb-10 mt-10 justify-center">
                
                {dashboardCards.filter(card => card.visible).map((card, index) => (
                    <div
                        key={index}
                        className=" ml-100 justify-center bg-gray-100 border-gray-300 rounded-md p-4 shadow-md w-1/2  text-center"
                        onClick={() => window.location.href = card.link}
                    >
                        <h3 className="text-lg">{card.title}</h3>
                        <p className="text-gray-600">{card.description}</p>
                        
                    </div>
                ))}
            </div>

        </div>
    );
}