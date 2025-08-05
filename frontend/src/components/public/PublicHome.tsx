import React, { JSX } from 'react';
import { NavLink } from 'react-router';

export function PublicHome(): JSX.Element {
    return (
        <div style={{ 
            padding: '40px 20px', 
            maxWidth: '1200px', 
            margin: '0 auto',
            textAlign: 'center'
        }}>
            {/* Hero Section */}
            <div style={{
                backgroundColor: '#f8f9fa',
                padding: '60px 40px',
                borderRadius: '12px',
                marginBottom: '40px',
                border: '1px solid #dee2e6'
            }}>
                <h1 style={{
                    fontSize: '3em',
                    margin: '0 0 20px 0',
                    color: '#333',
                    fontWeight: 'bold'
                }}>
                    Welcome to Our Blog
                </h1>
                <p style={{
                    fontSize: '1.2em',
                    color: '#666',
                    margin: '0 0 30px 0',
                    lineHeight: '1.6',
                    maxWidth: '600px',
                 
                }}>
                    Discover amazing articles, stories, and insights from our community of writers. 
                    Explore the latest posts and join the conversation!
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <NavLink 
                        to="/public/posts"
                        style={{
                            display: 'inline-block',
                            padding: '15px 30px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontSize: '1.1em',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 6px rgba(0,123,255,0.3)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#0056b3';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,123,255,0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#007bff';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,123,255,0.3)';
                        }}
                    >
                        Explore All Posts
                    </NavLink>
                    
                    <NavLink 
                        to="/login"
                        style={{
                            display: 'inline-block',
                            padding: '15px 30px',
                            backgroundColor: 'transparent',
                            color: '#007bff',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontSize: '1.1em',
                            fontWeight: '600',
                            border: '2px solid #007bff',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#007bff';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#007bff';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        Login / Register
                    </NavLink>
                </div>
            </div>
        </div>
    );
}