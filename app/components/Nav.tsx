"use client";
import React, { useEffect, useState } from 'react';

const Nav: React.FC<{ fullname?: string; onSignOut?: () => void }> = ({ fullname: propFullname, onSignOut }) => {
  const [fullname, setFullname] = useState<string | undefined>(propFullname);

  useEffect(() => {
    if (!propFullname && typeof window !== 'undefined') {
      const storedFullname = localStorage.getItem('fullname');
      if (storedFullname) setFullname(storedFullname);
    }
  }, [propFullname]);

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-blue-600 text-white">
      <div className="font-bold text-xl flex items-center gap-2">
        {fullname && <span className="ml-2 text-base font-normal">{fullname}</span>}
      </div>
      <div className="flex items-center gap-4">
        {onSignOut && (
          <button onClick={onSignOut} className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition-colors">Sign Out</button>
        )}
      </div>
    </nav>
  );
};

export default Nav;
