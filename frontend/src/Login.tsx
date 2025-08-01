import React, { JSX, useState } from 'react';
import { useNavigate } from "react-router";
import { LoginFormProps, RegisterFormProps } from './types';
import { authService } from './authService';

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
    const [showRegister, setShowRegister] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
  
    const navigate = useNavigate();
  
    const handleLogin = async (): Promise<void> => {
      if (!username.trim() || !password.trim()) {
        setErrorMessage('Please fill in all fields');
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        
        const response = await authService.login(username, password);
        //if (response.role === 'ADMIN') {
          navigate('/home');
        // } else if (response.role === 'AUTHOR') {
        //   navigate('/author/articles');
        // } else {
        //   navigate('/user/articles');
        // }
        
      } catch (err) {
        setErrorMessage("Wrong username or password!");
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleRegister = async (): Promise<void> => {
      if (!username.trim() || !password.trim() || !firstName.trim() || 
          !lastName.trim() || !email.trim()) {
        setErrorMessage('Please fill in all fields');
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        
        const response = await authService.register({
          username,
          password,
          firstName,
          lastName,
          email
        });
        
        //console.log("Registration successful:", response);
        navigate('/login');
        
      } catch (err) {
        //console.error("Registration error:", err);
        setErrorMessage("Registration failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    //console.log("showRegister:", username, password, firstName, lastName, email);
  
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>{showRegister ? "Register" : "Login"}</h2>
  
          {errorMessage && (
            <div style={{ color: 'red', marginBottom: '10px', padding: '10px'}}>
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div style={{ color: 'green', marginBottom: '10px', padding: '10px' }}>
              {successMessage}
            </div>
          )}
          
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

          {isLoading && (
            <div style={{ textAlign: 'center', margin: '10px 0' }}>
              <span>Loading...</span>
            </div>
          )}
        
          <div className="toggle-auth">
            {showRegister ? (
              <p>
                Already have an account?{' '}
                <span 
                  className="toggle-link" 
                  onClick={() => {
                    setShowRegister(false);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                >
                  Login
                </span>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <span 
                  className="toggle-link" 
                  onClick={() => {
                    setShowRegister(true);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                >
                  Register
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  } 