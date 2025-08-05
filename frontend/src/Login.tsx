import React, { JSX, useState } from 'react';
import { useNavigate } from "react-router";
import { LoginFormProps, RegisterFormProps } from './types';
import { authService } from './authService';
import  { useForm } from 'react-hook-form';

export function LoginForm({ username, password, setUsername, setPassword, onLogin }: LoginFormProps): JSX.Element {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setUsername(data.username);
    setPassword(data.password);
    await onLogin(data);
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="Username" {...register("username", {required: true})} />
      <input type="password" placeholder="Password" {...register("password", {required: true})} />
      <button type="submit">Login</button>
    </form>
  );
  }
  
  export function RegisterForm({
    username, password, firstName, lastName, email,
    setUsername, setPassword, setFirstName, setLastName, setEmail,
    onRegister
  }: RegisterFormProps): JSX.Element {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setEmail(data.email);
      setUsername(data.username);
      setPassword(data.password);
      
      await onRegister(data);
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="First name" {...register("firstName", {required: true, maxLength: 80})} />
        <input type="text" placeholder="Last name" {...register("lastName", {required: true, maxLength: 100})} />
        <input type="text" placeholder="Email" {...register("email", {required: true, pattern: /^\S+@\S+$/i})} />
        <input type="text" placeholder="Username" {...register("username", {required: true})} />
        <input type="password" placeholder="Password" {...register("password", {required: true})} />
        
        <button type="submit">Register</button>
      </form>
    )
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
  
      const handleLogin = async (formData?: any): Promise<void> => {
    const dataToUse = formData || {
      username: username.trim(),
      password: password.trim()
    };

    if (!dataToUse.username || !dataToUse.password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      const response = await authService.login(dataToUse.username, dataToUse.password);
        navigate('/home');  
    } catch (err) {
      setErrorMessage("Wrong username or password!");
    } finally {
      setIsLoading(false);
    }
  };
  
      const handleRegister = async (formData?: any): Promise<void> => {
    // Folosește datele din form dacă sunt disponibile, altfel folosește state-urile
    const dataToUse = formData || {
      username: username.trim(),
      password: password.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim()
    };

    if (!dataToUse.username || !dataToUse.password || !dataToUse.firstName || 
        !dataToUse.lastName || !dataToUse.email) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      const response = await authService.register({
        username: dataToUse.username,
        password: dataToUse.password,
        firstName: dataToUse.firstName,
        lastName: dataToUse.lastName,
        email: dataToUse.email
      });
      if (response.token !== null) {
        setSuccessMessage('Registration successful. Please login.');
        navigate('/home');
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
      
    } catch (err) {
      setErrorMessage("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
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