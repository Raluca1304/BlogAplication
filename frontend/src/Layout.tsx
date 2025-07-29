import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router';
import { LogoutButton } from './LogoutButton';

export function Layout(): JSX.Element {
  const location = useLocation();
  const role: string | null = localStorage.getItem('role');
  const isLoggedIn: boolean = !!localStorage.getItem('jwt');
  const isLoginPage: boolean = location.pathname === "/login";
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <div className="layout-root">
      {!isLoginPage && isLoggedIn && (
        <>
          <div className={`sidebar${sidebarOpen ? ' open' : ''}`}>
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(false)}>
              <svg width="28" height="28" viewBox="0 0 28 28">
                <polyline points="18,6 10,14 18,22" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <nav className="sidebar-nav">
              <NavLink to="/home" className="sidebar-link">Home</NavLink>
              <NavLink to="/posts" className="sidebar-link">All Posts</NavLink>
                <NavLink to="/users" className="sidebar-link">All Users</NavLink>
                <NavLink to="/create" className="sidebar-link">Create Post</NavLink>
              <div className="sidebar-spacer" />
              <LogoutButton />
            </nav>
          </div>
          {!sidebarOpen && (
            <button
              className="sidebar-hamburger"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
          )}
        </>
      )}
      <main className={(!isLoginPage && isLoggedIn) ? 'with-sidebar' : ''}>
        <Outlet />
      </main>
    </div>
  );
} 