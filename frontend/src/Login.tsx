import React, { useState } from 'react';
import { useNavigate } from "react-router";
import { LoginFormProps, RegisterFormProps } from './types';

interface LoginResponse {
  token?: string;
  username?: string;
  role?: string;
}

interface RegisterResponse {
  success: boolean;
  message?: string;
}

export function LoginForm({ username, password, setUsername, setPassword, onLogin }: LoginFormProps): JSX.Element {
    return (
      <>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={onLogin}>Login</button>
      </>
    );
  }
  
  
  export function RegisterForm({
    username, password, firstName, lastName, email,
    setUsername, setPassword, setFirstName, setLastName, setEmail,
    onRegister
  }: RegisterFormProps): JSX.Element {
    return (
      <>
        <input
          type="text"
          placeholder="first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
          <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={onRegister}>Register</button>
      </>
    );
  }
  
  export function Login(): JSX.Element {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [token, setToken] = useState<string | null>(null);
    const [showRegister, setShowRegister] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [role, setRole] = useState<string>('');
  
    const navigate = useNavigate();
  
    const handleLogin = async (): Promise<void> => {
      try {
        const res = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
  
        const data: LoginResponse = await res.json();
        console.log("login response:", data);
        if (data.token) {
          setToken(data.token);
          localStorage.setItem('jwt', data.token);
          localStorage.setItem('username', data.username || username);
          if (data.role) {
            localStorage.setItem('role', data.role || role);
          }
          navigate('/posts');
        } else {
          alert("Wrong username or password!");
        }
      } catch (err) {
        console.error("Eroare la login:", err);
      }
    };
  
    const handleRegister = async (): Promise<void> => {
      try {
        const res = await fetch('/api/users/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, firstName, lastName, email })
        });
  
        const data: RegisterResponse = await res.json();
        alert("Register successful! You can now log in.");
        setShowRegister(false);
      } catch (err) {
        console.error("Eroare la register:", err);
      }
    };
  
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>{showRegister ? "Register" : "Login"}</h2>
  
          {showRegister ? (
            <RegisterForm
              username={username}
              password={password}
              firstName={firstName}
              lastName={lastName}
              email={email}
              setUsername={setUsername}
              setPassword={setPassword}
              setFirstName={setFirstName}
              setLastName={setLastName}
              setEmail={setEmail}
              onRegister={handleRegister}
            />
          ) : (
            <LoginForm
              username={username}
              password={password}
              setUsername={setUsername}
              setPassword={setPassword}
              onLogin={handleLogin}
            />
          )}
  
          <div className="toggle-auth">
            {showRegister ? (
              <p>
                Already have an account?{' '}
                <span className="toggle-link" onClick={() => setShowRegister(false)}>
                  Login
                </span>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <span className="toggle-link" onClick={() => setShowRegister(true)}>
                  Register
                </span>
              </p>
            )}
          </div>
  
          {token && <p style={{ marginTop: "15px" }}>Token: {token}</p>}
        </div>
      </div>
    );
  } 