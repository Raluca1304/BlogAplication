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
import { AllPosts, PostDetail, PublicHome} from './src/components/public';
import { EditMyArticle } from './src/components/public/EditMyArticle';
import { CreateMyArticle } from './src/components/public/CreateMyArticle';


export function BlogApp(): JSX.Element {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout />}> {/* been here */}
            <Route index element={<PublicHome />} /> {/* been here */}
            <Route path="home" element={<Home />} /> {/* been here */}
            <Route path="login" element={<Login />} />  {/* been here */}
            <Route path="admin/dashboard" element={<AdminDashboard />} /> {/* IDEAS */}
            <Route path="admin/articles" element={<Articles />} /> {/* been here */}
            <Route path="admin/articles/:id" element={<Article />} /> {/* been here */}
            <Route path="admin/articles/:id/edit" element={<EditArticle />} /> {/* been here */}
            <Route path="admin/comments" element={<Comments />} /> {/* been here */}
            <Route path="admin/comments/:id" element={<Comment />} /> {/* been here */}
            <Route path="admin/comments/:id/edit" element={<EditCommentPage />} />
            <Route path="users/:id" element={<UsersPosts />} /> {/* been here */}
            <Route path="create" element={<CreateArticle />} /> {/* been here */}
            <Route path="admin/users" element={<Users />} />      
            <Route path="admin/users/:id" element={<User />} />
            <Route path="admin/users/:id/edit" element={<EditUser />} />
            <Route path="public/posts" element={<AllPosts />} /> {/* been here */}
            <Route path="public/posts/:id" element={<PostDetail />} /> {/* been here */}
            <Route path="public/users/:id" element={<UsersPosts />} /> {/* been here */}
            <Route path="public/articles/create" element={<CreateMyArticle />} /> {/* been here */}
            <Route path="public/articles/:id/edit" element={<EditMyArticle />} /> {/* been here */}
            </Route>
        </Routes>
    </BrowserRouter>
  );
} 