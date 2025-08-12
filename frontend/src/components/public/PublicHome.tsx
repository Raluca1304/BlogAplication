import { Button } from '@/components/ui/button';
import React, { JSX } from 'react';
import { NavLink } from 'react-router';

export function PublicHome(): JSX.Element {
    return (
        <div 
        className="p-4 max-w-2xl mx-auto mt-10">
            {/* Hero Section */}
            <div className="mb-4">
                <h1 className="text-4xl font-bold mb-4 text-center">
                    Welcome to Our Blog
                </h1>
                <p className="text-lg text-gray-600 mb-6 text-center">
                    Discover amazing articles, stories, and insights from our community of writers. 
                    Explore the latest posts and join the conversation!
                </p>
                
                    <div className="p-1 flex gap-2 justify-center">
                    <Button variant="burgundy">
                        <NavLink to="/public/posts">
                            Explore All Posts
                        </NavLink>
                    </Button>
                    <Button variant="navy"> 
                    <NavLink 
                        to="/login">
                        Login / Register
                    </NavLink>
                    </Button>
                </div>
            </div>
        </div>
    );
}