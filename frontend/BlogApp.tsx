import React, { JSX } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Layout } from './src/components/public/Layout';
import { Articles } from './src/components/admin/Articles/Articles';
import { Article } from './src/components/admin/Articles/Article/Article';
import { Comments } from './src/components/admin/Comments/Comments';
import { Comment } from './src/components/admin/Comments/Comment/Comment';
import { EditCommentPage } from './src/components/admin/Comments/Comment/EditComment';
import { Login } from './src/components/public/Login';
import { UsersPosts } from './src/components/public/UsersPosts';
import { CreateArticle } from './src/components/admin/Articles/Article/CreateArticle';
import { EditArticle } from './src/components/admin/Articles/Article/EditArticle';
import { Home } from './src/components/public/Home';
import { Users } from './src/components/admin/Users/Users';
import { User } from './src/components/admin/Users/User/User';
import { EditUser } from './src/components/admin/Users/User/EditUser';
import { AdminDashboard } from './src/components/admin/Actions/AdminDashboard';
import { Posts } from './src/Posts';
import { AllPosts, PostDetail, PublicHome } from './src/components/public';

export function BlogApp(): JSX.Element {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={<PublicHome />} />
            <Route path="home" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/articles" element={<Articles />} />
            <Route path="admin/articles/:id" element={<Article />} />
            <Route path="admin/articles/:id/edit" element={<EditArticle />} />
            <Route path="admin/comments" element={<Comments />} />
            <Route path="admin/comments/:id" element={<Comment />} />
            <Route path="admin/comments/:id/edit" element={<EditCommentPage />} />
            <Route path="users/:id" element={<UsersPosts />} />
            <Route path="create" element={<CreateArticle />} />
            <Route path="admin/users" element={<Users />} />
            <Route path="admin/users/:id" element={<User />} />
            <Route path="admin/users/:id/edit" element={<EditUser />} />
            <Route path="public/posts" element={<AllPosts />} />
            <Route path="public/posts/:id" element={<PostDetail />} />
            <Route path="public/users/:id" element={<UsersPosts />} />
            </Route>
        </Routes>
    </BrowserRouter>
  );
} 