"use client";
import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';
import api from '../lib/axios';
import { useRouter } from 'next/navigation';

const LOGIN_ROUTE = '/login';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await api.post(LOGIN_ROUTE, {
        email,
        password,
      });
      setSuccess('Login successful!');
      if (response.data && response.data.user.fullname && typeof window !== 'undefined') {
        localStorage.setItem('fullname', response.data.user.fullname);
      }
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('justLoggedIn', 'true');
      }
      setTimeout(() => {
        router.push('/home');
      }, 1000);
    } catch (err) {
      let errorMsg = 'Login failed';
      if (typeof err === 'object' && err !== null) {
        if ('response' in err && typeof err.response === 'object' && err.response !== null && 'data' in err.response) {
          errorMsg = (err.response as { data?: { message?: string } }).data?.message || errorMsg;
        } else if ('message' in err && typeof err.message === 'string') {
          errorMsg = err.message;
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6 bg-white rounded shadow-md space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}
        {success && <div className="text-green-500 text-center">{success}</div>}
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button type="submit" >{loading ? 'Logging in...' : 'Login'}</Button>
         <div className="text-center mt-4">
        <a href="/register" className="text-blue-600 hover:underline">Don&apos;t have an account? Register</a>
      </div>
      </form>
     
    </>
  );
};

export default LoginForm;
