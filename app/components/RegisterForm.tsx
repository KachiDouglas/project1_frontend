"use client";
import React, { useState, useEffect } from 'react';
import Input from './Input';
import Button from './Button';
import api from '../lib/axios';

const REGISTER_ROUTE = '/register';

const TOAST_DURATION = 3000; // 3 seconds

const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg z-50 ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
      {message}
    </div>
  );
};

const RegisterForm: React.FC = () => {
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);
    try {
      await api.post(REGISTER_ROUTE, {
        fullname,
        phoneNumber: phone, // changed from 'phone' to 'phoneNumber'
        email,
        password,
      });
      setToast({ message: 'Registration successful!', type: 'success' });
      setFullname('');
      setPhone('');
      setEmail('');
      setPassword('');
    } catch (err) {
      // TypeScript-safe error handling
      let errorMsg = 'Registration failed';
      if (typeof err === 'object' && err !== null) {
        if ('response' in err && typeof err.response === 'object' && err.response !== null && 'data' in err.response) {
          errorMsg = (err.response as { data?: { message?: string } }).data?.message || errorMsg;
        } else if ('message' in err && typeof err.message === 'string') {
          errorMsg = err.message;
        }
      }
      setToast({ message: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6 bg-white rounded shadow-md space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <Input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={fullname}
          onChange={e => setFullname(e.target.value)}
        />
        <Input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
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
        <Button type="submit" >{loading ? 'Submitting...' : 'Sign Up'}</Button>
        <div className="text-center mt-4">
        <a href="/login" className="text-blue-600 hover:underline">Already have an account? Login</a>
      </div>
      </form>
      
    </>
  );
};

export default RegisterForm;
