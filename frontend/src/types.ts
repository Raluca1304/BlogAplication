export interface ActionButtonProps {
  onClick: () => void;
  type: 'edit' | 'delete' | 'view';
  children: React.ReactNode;
  disabled?: boolean;
}

export interface ActionButtonGroupProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
  showView?: boolean;
}

export interface EditCommentProps {
  commentId: string;
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  summary: string;
  authorName: string;
  authorId: string;
  createdDate: string;
  updatedDate?: string;
}

export interface Article {
  id: string;
  title: string;
  author: string;
  authorId: string;
  summary: string;
  createdDate: string;
}

export interface Comment {
  id: string;
  text: string;
  createdDate: string;
  authorName: string;
  article: Post;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface JwtResponse {
  token: string;
  role: string;
  username: string;
}

export interface UserPermissions {
  username: string;
  role: string;
  isAdmin: boolean;
  isAuthor: boolean;
  canCreateArticles: boolean;
  canEditAllArticles: boolean;
  canDeleteAllArticles: boolean;
  canManageUsers: boolean;
}

export const ROLES = {
  USER: 'ROLE_USER',
  AUTHOR: 'ROLE_AUTHOR',
  ADMIN: 'ROLE_ADMIN'
} as const;


export interface LoginFormProps {
  username: string;
  password: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  onLogin: (formData?: any) => void;
}

export interface RegisterFormProps {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setEmail: (email: string) => void;
  setShowRegister: (show: boolean) => void;
  onRegister: (formData?: any) => void;
}

export interface ArticleFormProps {
  articleId?: string;
  initialData?: Partial<Post>;
  onSave: (article: Post) => void;
  onCancel: () => void;
  onBack?: () => void;
  mode: 'create' | 'edit';
}

export interface FormDataArticle {
  title: string;
  content: string;
}

export interface CommentFormProps {
  commentId?: string;
  initialData?: Partial<Comment>;
  onSave: (comment: Comment) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
  showArticleInfo?: boolean;
}

export interface FormDataComment {
  text: string;
}

export interface FormDataUser {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const roleUtils = {
  isAdmin: (role: string | null): boolean => role === ROLES.ADMIN,
  isAuthor: (role: string | null): boolean => role === ROLES.AUTHOR,
  isUser: (role: string | null): boolean => role === ROLES.USER,
  canCreateArticles: (role: string | null): boolean => 
    role === ROLES.ADMIN || role === ROLES.AUTHOR,
  canManageUsers: (role: string | null): boolean => role === ROLES.ADMIN,
  canEditAllArticles: (role: string | null): boolean => role === ROLES.ADMIN,
}; 

export interface DashboardStats {
  articlesCount: number;
  commentsCount: number;
  usersCount: number;
}