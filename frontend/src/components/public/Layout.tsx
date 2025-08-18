import React, { JSX, useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router';
import { roleUtils } from '../../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, LogOut, LogIn , Telescope, Mail} from 'lucide-react';
import { getInitials } from '../admin/utils/formatDataTime';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

export function Layout(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const role: string | null = localStorage.getItem('role');
  const isLoggedIn: boolean = !!localStorage.getItem('jwt');
  const isLoginPage: boolean = location.pathname === "/login";
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/public/posts?search=${searchQuery}&searchBy=title`);
      setSearchQuery('');
    }
  };




  if (isLoginPage) {
    return (
      <div className="min-h-screen">
        <div className="p-4 border-b border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex items-center gap-2 text-gray-700 text-lg font-medium">
              <Telescope className="h-5 w-5" />
              Travel Blog
            </div>
          </div>
        </div>
        <div className="p-4 w-full mx-auto flex items-start justify-center min-h-[calc(100vh-80px)] pt-6">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div  className="p-4 border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center gap-4">
          {/* Avatar and Welcome Message */}
          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <Button
                variant="navyRounded"
                title="View Profile" 
              >
                {getInitials(localStorage.getItem('username'))}
              </Button>
            )}
            <h3 className="text-lg font-medium text-gray-700">
              {isLoggedIn ? (
                <>Welcome, {localStorage.getItem('username') || 'User'} !</>
              ) : (
                <>  
                  <div className="flex items-center gap-2">
                    <Telescope className="h-5 w-5" />
                    Travel Blog
                  </div>
                </>
              )}
            </h3>
          </div>       

          <div className="flex items-center gap-6">
            {isLoggedIn && (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[200px] p-2 border border-gray-300 rounded-md pl-9"
                  />
                </div>
              </form>
            )}
            
            <NavigationMenu>
              <NavigationMenuList>
                {isLoggedIn ? (
                  <>
                    {(roleUtils.isAdmin(role) || roleUtils.isAuthor(role) || roleUtils.isUser(role)) && (
                      <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                          <NavLink to="/home">Home</NavLink>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )}
                    
                    {roleUtils.isAdmin(role) && (
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>Admin</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[200px] gap-4">
                            <li>
                              <NavigationMenuLink asChild>
                                <NavLink to="/admin/dashboard">
                                  <div className="font-medium">Dashboard</div>
                                  <div className="text-muted-foreground">
                                    Admin panel overview
                                  </div>
                                </NavLink>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink asChild>
                                <NavLink to="/admin/users">
                                  <div className="font-medium">Users</div>
                                  <div className="text-muted-foreground">
                                    Manage users and roles
                                  </div>
                                </NavLink>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink asChild>
                                <NavLink to="/admin/articles">
                                  <div className="font-medium">Articles</div>
                                  <div className="text-muted-foreground">
                                    Manage all articles
                                  </div>
                                </NavLink>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink asChild>
                                <NavLink to="/admin/comments">
                                  <div className="font-medium">Comments</div>
                                  <div className="text-muted-foreground">
                                    Moderate comments
                                  </div>
                                </NavLink>
                              </NavigationMenuLink>
                            </li>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    )}
                    
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Content</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-4">
                          <li>
                            <NavigationMenuLink asChild>
                              <NavLink to="/public/posts">
                                <div className="font-medium">All Posts</div>
                                <div className="text-muted-foreground">
                                  Browse all articles
                                </div>
                              </NavLink>
                            </NavigationMenuLink>
                          </li>
                          {(roleUtils.isAuthor(role) || roleUtils.isAdmin(role)) && (
                            <li>
                              <NavigationMenuLink asChild>
                                <NavLink to="/create">
                                  <div className="font-medium">Create Article</div>
                                  <div className="text-muted-foreground">
                                    Write a new article
                                  </div>
                                </NavLink>
                              </NavigationMenuLink>
                            </li>
                          )}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </>
                ) : (
                  <>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <NavLink to="/">Home</NavLink>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <NavLink to="/public/posts">All Posts</NavLink>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    
                    <NavigationMenuItem>
                      <Button variant="navy" className="flex items-center gap-2">
                        <NavLink to="/login" className="flex items-center gap-2">
                          <LogIn className='h-4 w-4'/>
                          Login
                        </NavLink>
                      </Button>
                    </NavigationMenuItem>
                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>
            
            {isLoggedIn && (
              <div className="flex items-center gap-2">
                
              <Button 
                variant="redDark" 
                onClick={handleLogout}
              >
                    Logout
                    <LogOut className="h-4 w-4" />
              </Button>
              
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 w-full mx-auto mt-10">
        <Outlet />
      </div>
      
    </div>
  );
} 