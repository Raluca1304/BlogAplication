import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Layout } from './Layout';
import { Posts } from './Posts';
import { PostItem } from './PostItem';
import { Login } from './Login';  
import { UsersPosts } from './UsersPosts';
import { CreateArticle } from './CreateArticle';
import { EditArticle } from './EditArticle';
import { Home } from './Home';
import { UsersList } from './UsersList';

export function BlogApp(): JSX.Element {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/login" />} />
            <Route path="home" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="posts" element={<Posts />} />
            <Route path="posts/:id" element={<PostItem />} />
            <Route path="posts/:id/edit" element={<EditArticle />} />
            <Route path="users/:id" element={<UsersPosts />} />
            <Route path="create" element={<CreateArticle />} />
            <Route path="users" element={<UsersList />} />
            </Route>
        </Routes>
    </BrowserRouter>
  );
} 