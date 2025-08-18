import React, { JSX, useState } from 'react';
import { NavLink, useNavigate } from "react-router";
import { LoginFormProps, RegisterFormProps } from '../../types';
import { authService } from './authService';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
      <div 
      className="mb-4"
      >
        <Input
          variant="user"
          type="text" 
          placeholder="Username" 
          {...register("username")} 
        />
        {errors.username && (
          <span className="text-red-500 text-sm">
            {errors.username.message}
          </span>
        )}
      </div>

      <div 
      className="mb-4"
      >
        <Input 
          variant="lock"
          type="password" 
          placeholder="Password" 
          {...register("password")} 
        />
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}
      </div>

      <Button 
        type="submit"
        variant="navy"
        className="w-full"
      >
        Sign in
      </Button>
    </form>
  );
}
  
export function RegisterForm({
  username, password, firstName, lastName, email,
  setUsername, setPassword, setFirstName, setLastName, setEmail,
  setShowRegister,
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
    <Card className="p-7 mb-60">
      <CardHeader>
        <CardTitle className="text-center">Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
      <div 
      className="mb-4"
      >
        <Input 
          type="text" 
          placeholder="First name" 
          {...register("firstName")} 
        />
        {errors.firstName && (
          <span className="text-red-500 text-sm">
            {errors.firstName.message}
          </span>
        )}
      </div>

      <div 
      className="mb-4"
      >
        <Input 
          type="text" 
          placeholder="Last name" 
          {...register("lastName")} 
        />
        {errors.lastName && (
          <span className="text-red-500 text-sm">
            {errors.lastName.message}
          </span>
        )}
      </div>

      <div 
      className="mb-4"
      >
        <Input 
          type="email" 
          placeholder="Email" 
          {...register("email")} 
        />
        {errors.email && (
          <span className="text-red-500 text-sm">
            {errors.email.message}
          </span>
        )}
      </div>

      <div 
      className="mb-4"
      >
        <Input 
          type="text" 
          placeholder="Username" 
          {...register("username")} 
        />
        {errors.username && (
          <span className="text-red-500 text-sm">
            {errors.username.message}
          </span>
        )}
      </div>

        <div 
      className="mb-4"
      >
        <Input 
          type="password" 
          placeholder="Password" 
          {...register("password")} 
        />
        {errors.password && (
            <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}
      </div>
        <CardFooter className="px-0 flex gap-2">
          <Button type="submit" variant="greenDark" className="w-full">Sign up</Button>
        </CardFooter>
        <CardFooter>
          <h2 className="text-center">
            Already have an account?
            <Button
              variant="link"
              size="sm"

              className="text-blue-500 hover:text-blue-600 text-center px-0 py-0 h-auto ml-1 mt-2"
              onClick={() => setShowRegister(false)}
            >Sign in</Button>
          </h2>
        </CardFooter>
        </form>
      </CardContent>
    </Card>
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
      if (username === dataToUse.username || email === dataToUse.email) {
        setErrorMessage("Username or email already exists");
        setIsLoading(false);
        return;
      }

      if (response.token !== null) {
        setSuccessMessage('Registration successful. Please login.');
        navigate('/home');
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
      
    } catch (err) {
      setErrorMessage("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
    return (

      <div className="flex justify-center items-center h-screen">
        <div className="p-7 max-w-2xl mx-auto mt-10">
          {errorMessage && (
            <div className="text-red-500 text-sm">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="text-green-500 text-sm">
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
              setShowRegister={setShowRegister}
              onRegister={handleRegister}
            />
          ) : (
            <Card className="p-7 mb-60">
              <CardHeader>
                <CardTitle className="text-center">Welcome back !</CardTitle>
                <CardDescription className="text-center">Sign in to your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm
                  username={username}
                  password={password}
                  setUsername={setUsername}
                  setPassword={setPassword}
                  onLogin={handleLogin}
                />
                {/* <Checkbox
                  id="remember-me"
                  label="Remember me"
                /> */}
              </CardContent>
              <CardFooter>
                <h2 className="text-center">
                  Don't have an account?
                  <Button
                    variant="link"
                    size="sm"
                    className="text-blue-500 hover:text-blue-600 text-center px-0 py-0 h-auto ml-1"
                    onClick={() => setShowRegister(true)}
                  >
                    Register
                  </Button>
                </h2>
              </CardFooter>
            </Card>
          )}

          {isLoading && (
            <div className="text-center mt-2">
              <span>Loading...</span>
            </div>
          )}
        </div>
      </div>
    );
  } 