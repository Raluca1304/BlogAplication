import React, { useState, useEffect } from 'react';
import { roleUtils } from '../../types';

interface DashboardStats {
    articlesCount: number;
    commentsCount: number;
    usersCount: number;
}

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
        },
        {
            title: "Create Article",
            description: "Write and publish new articles",
            count: null,
            link: "/create",
            visible: roleUtils.canCreateArticles(role)
        }
    ];

    if (loading) {
        return <div style={{ padding: '20px' }}>Loading...</div>;
    }

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1>Admin Dashboard</h1>
                <p>Welcome to the administration panel. Manage your blog content and users.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px',
                marginBottom: '40px'
            }}>
                {dashboardCards.filter(card => card.visible).map((card, index) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #dee2e6',
                            borderRadius: '8px',
                            padding: '20px',
                            cursor: 'pointer',
                            textAlign: 'center'
                        }}
                        onClick={() => window.location.href = card.link}
                    >
                        <h3>{card.title}</h3>
                        <p style={{ color: '#666', fontSize: '14px' }}>{card.description}</p>
                        
                    </div>
                ))}
            </div>

        </div>
    );
}