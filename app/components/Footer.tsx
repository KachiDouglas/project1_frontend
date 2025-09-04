import React from 'react';

const Footer: React.FC = () => (
  <footer className="py-6 text-center bg-gray-100 text-gray-500 mt-12">
    &copy; {new Date().getFullYear()} MyApp. All rights reserved.
  </footer>
);

export default Footer;
