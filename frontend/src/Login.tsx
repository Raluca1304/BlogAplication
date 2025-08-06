import React, { JSX, useState } from 'react';
import { useNavigate } from "react-router";
import { LoginFormProps, RegisterFormProps } from './types';
import { authService } from './authService';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


const loginSchema = yup
  .object({
    username: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
    password: yup.string().required('Password is required')
  })
  .required();


const registerSchema = yup
  .object({
    firstName: yup.string().required('First name is required').min(2, 'First name must be at least 2 characters').max(80, 'First name must be less than 80 characters'),
    lastName: yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters').max(100, 'Last name must be less than 100 characters'),
    email: yup.string().required('Email is required').email('Please enter a valid email'),
    username: yup.string().required('Username is required').min(6, 'Username must be at least 3 characters'),
    password: yup.string().required('Password is required')
  })
  .required();

interface LoginFormData {
  username: string;
  password: string;
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export function LoginForm({ username, password, setUsername, setPassword, onLogin }: LoginFormProps): JSX.Element {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    setUsername(data.username);
    setPassword(data.password);
    await onLogin(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ marginBottom: '15px' }}>
        <input 
          type="text" 
          placeholder="Username" 
          {...register("username")} 
          style={{
            width: '100%',
            padding: '12px',
            border: errors.username ? '1px solid #dc3545' : '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            marginBottom: '5px'
          }}
        />
        {errors.username && (
          <span style={{ color: '#dc3545', fontSize: '14px' }}>
            {errors.username.message}
          </span>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <input 
          type="password" 
          placeholder="Password" 
          {...register("password")} 
          style={{
            width: '100%',
            padding: '12px',
            border: errors.password ? '1px solid #dc3545' : '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            marginBottom: '5px'
          }}
        />
        {errors.password && (
          <span style={{ color: '#dc3545', fontSize: '14px' }}>
            {errors.password.message}
          </span>
        )}
      </div>

      <button 
        type="submit"
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Login
      </button>
    </form>
  );
}
  
export function RegisterForm({
  username, password, firstName, lastName, email,
  setUsername, setPassword, setFirstName, setLastName, setEmail,
  onRegister
}: RegisterFormProps): JSX.Element {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setEmail(data.email);
    setUsername(data.username);
    setPassword(data.password);
    
    await onRegister(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ marginBottom: '15px' }}>
        <input 
          type="text" 
          placeholder="First name" 
          {...register("firstName")} 
          style={{
            width: '100%',
            padding: '12px',
            border: errors.firstName ? '1px solid #dc3545' : '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            marginBottom: '5px'
          }}
        />
        {errors.firstName && (
          <span style={{ color: '#dc3545', fontSize: '14px' }}>
            {errors.firstName.message}
          </span>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <input 
          type="text" 
          placeholder="Last name" 
          {...register("lastName")} 
          style={{
            width: '100%',
            padding: '12px',
            border: errors.lastName ? '1px solid #dc3545' : '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            marginBottom: '5px'
          }}
        />
        {errors.lastName && (
          <span style={{ color: '#dc3545', fontSize: '14px' }}>
            {errors.lastName.message}
          </span>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <input 
          type="email" 
          placeholder="Email" 
          {...register("email")} 
          style={{
            width: '100%',
            padding: '12px',
            border: errors.email ? '1px solid #dc3545' : '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            marginBottom: '5px'
          }}
        />
        {errors.email && (
          <span style={{ color: '#dc3545', fontSize: '14px' }}>
            {errors.email.message}
          </span>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <input 
          type="text" 
          placeholder="Username" 
          {...register("username")} 
          style={{
            width: '100%',
            padding: '12px',
            border: errors.username ? '1px solid #dc3545' : '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            marginBottom: '5px'
          }}
        />
        {errors.username && (
          <span style={{ color: '#dc3545', fontSize: '14px' }}>
            {errors.username.message}
          </span>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <input 
          type="password" 
          placeholder="Password" 
          {...register("password")} 
          style={{
            width: '100%',
            padding: '12px',
            border: errors.password ? '1px solid #dc3545' : '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            marginBottom: '5px'
          }}
        />
        {errors.password && (
          <span style={{ color: '#dc3545', fontSize: '14px' }}>
            {errors.password.message}
          </span>
        )}
      </div>
      
      <button 
        type="submit"
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Register
      </button>
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