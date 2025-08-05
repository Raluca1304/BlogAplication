import React, { JSX, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router';
import { LogoutButton } from './LogoutButton';
import { roleUtils } from './types';

export function Layout(): JSX.Element {
  const location = useLocation();
  const role: string | null = localStorage.getItem('role');
  const isLoggedIn: boolean = !!localStorage.getItem('jwt');
  const isLoginPage: boolean = location.pathname === "/login";
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <div className="layout-root">
      {!isLoginPage && (
        <>
          <div className={`sidebar${sidebarOpen ? ' open' : ''}`}>
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(false)}>
              <svg width="28" height="28" viewBox="0 0 28 28">
                <polyline points="18,6 10,14 18,22" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <nav className="sidebar-nav">
              {/* Content for logged in users */}
              {isLoggedIn ? (
                <>
                  {/* Home - visible for ADMIN and AUTHOR */}
                  {(roleUtils.isAdmin(role) || roleUtils.isAuthor(role) || roleUtils.isUser(role)) && (
                    <NavLink to="/home" className="sidebar-link">Home</NavLink>
                  )}
                  {/* <NavLink to="/profile" className="sidebar-link">Profile</NavLink> */}
                  
                  {/* Admin Panel - only for ADMIN */}
                  {roleUtils.isAdmin(role) && (
                    <NavLink to="/admin/dashboard" className="sidebar-link">
                      Admin Panel
                    </NavLink>
                  )}
                  
                  {/* Public Posts - visible for USER and AUTHOR */}
                  {/* {(roleUtils.isUser(role) || roleUtils.isAuthor(role)) && ( */}
                    <NavLink to="/public/posts" className="sidebar-link">All Posts</NavLink>
                  {/* )} */}
                  
                  {/* Create article - only for AUTHORS */}
                  {roleUtils.isAuthor(role) && (
                    <NavLink to="/create" className="sidebar-link">Create new article</NavLink>
                  )}
                  
                  <div className="sidebar-spacer" />
                  <LogoutButton />
                </>
              ) : (
                <>
                  {/* Content for non-logged users */}
                  <NavLink to="/" className="sidebar-link">Home</NavLink>
                  <NavLink to="/public/posts" className="sidebar-link"> All Posts</NavLink>
                  
                  <div className="sidebar-spacer" />
                  <NavLink 
                    to="/login" 
                    className="sidebar-link"
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      borderRadius: '6px',
                      margin: '10px'
                    }}
                  >
                    Login / Register
                  </NavLink>
                </>
              )}
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
      <main className={!isLoginPage ? 'with-sidebar' : ''}>
        <Outlet />
      </main>
    </div>
  );
} 