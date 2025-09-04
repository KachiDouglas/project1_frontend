"use client";
import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Card from '../components/Card';
import Footer from '../components/Footer';
import api from '../lib/axios';
import { useRouter } from 'next/navigation';

const cards = [
  { title: 'Feature One', description: 'Description for feature one.' },
  { title: 'Feature Two', description: 'Description for feature two.' },
  { title: 'Feature Three', description: 'Description for feature three.' },
  { title: 'Feature Four', description: 'Description for feature four.' },
];

const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg z-50 bg-green-500 text-white">
      {message}
    </div>
  );
};

const HomePage: React.FC = () => {
  const [fullname, setFullname] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // If just logged in, skip guard once
    if (typeof window !== 'undefined' && sessionStorage.getItem('justLoggedIn') === 'true') {
      sessionStorage.removeItem('justLoggedIn');
      const storedFullname = localStorage.getItem('fullname');
      if (storedFullname) setFullname(storedFullname);
      setLoading(false);
      return;
    }
    api.get('/me')
      .then(res => {
        setFullname(res.data.fullname);
        if (typeof window !== 'undefined') {
          localStorage.setItem('fullname', res.data.fullname);
        }
        setLoading(false);
      })
      .catch(() => {
        setFullname(null);
        setLoading(false);
        router.replace('/login');
      });
  }, [router]);

  const handleSignOut = async () => {
    await api.post('/logout');
    setFullname(null);
    setToast('Signed out successfully!');
    setTimeout(() => {
      setToast(null);
      router.push('/login');
    }, 1500);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <Nav fullname={fullname || undefined} onSignOut={handleSignOut} />
      <Hero />
      <main className="flex-1 py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
          {cards.map((card, idx) => (
            <Card key={idx} title={card.title} description={card.description} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
