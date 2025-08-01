import { JwtResponse, UserPermissions, roleUtils } from './types';

class AuthService {
  private readonly TOKEN_KEY = 'jwt';
  private readonly USERNAME_KEY = 'username';
  private readonly ROLE_KEY = 'role';

  // Authentication methods
  async login(username: string, password: string): Promise<JwtResponse> {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data: JwtResponse = await response.json();
    this.saveAuthData(data);
    return data;
  }

  async register(userData: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<JwtResponse> {
    const response = await fetch('/api/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data: JwtResponse = await response.json();
    this.saveAuthData(data);
    return data;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    localStorage.removeItem(this.ROLE_KEY);
  }

  // Token management
  private saveAuthData(data: JwtResponse): void {
    localStorage.setItem(this.TOKEN_KEY, data.token);
    localStorage.setItem(this.USERNAME_KEY, data.username);
    localStorage.setItem(this.ROLE_KEY, data.role);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Role checking methods
  isAdmin(): boolean {
    return roleUtils.isAdmin(this.getRole());
  }

  isAuthor(): boolean {
    return roleUtils.isAuthor(this.getRole());
  }

  isUser(): boolean {
    return roleUtils.isUser(this.getRole());
  }

  canCreateArticles(): boolean {
    return roleUtils.canCreateArticles(this.getRole());
  }

  canManageUsers(): boolean {
    return roleUtils.canManageUsers(this.getRole());
  }

  canEditAllArticles(): boolean {
    return roleUtils.canEditAllArticles(this.getRole());
  }

  // API call with authorization header
  async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }

  // Get user permissions (for complex permission checking)
  async getUserPermissions(): Promise<UserPermissions> {
    const response = await this.fetchWithAuth('/api/auth/check-permission');
    
    if (!response.ok) {
      throw new Error('Failed to get user permissions');
    }

    return response.json();
  }

  // Check if user has specific permission
  hasPermission(permission: keyof UserPermissions): boolean {
    const role = this.getRole();
    
    switch (permission) {
      case 'isAdmin':
        return this.isAdmin();
      case 'isAuthor':
        return this.isAuthor();
      case 'canCreateArticles':
        return this.canCreateArticles();
      case 'canEditAllArticles':
        return this.canEditAllArticles();
      case 'canDeleteAllArticles':
        return this.canEditAllArticles(); // Same as edit for now
      case 'canManageUsers':
        return this.canManageUsers();
      default:
        return false;
    }
  }

  // Get user info summary
  getUserInfo(): { username: string | null; role: string | null; isAuthenticated: boolean } {
    return {
      username: this.getUsername(),
      role: this.getRole(),
      isAuthenticated: this.isAuthenticated()
    };
  }
}

// Export singleton instance
export const authService = new AuthService(); 