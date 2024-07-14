// components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 p-4 text-center text-white">
      &copy; {new Date().getFullYear()} Lex3 LLC
    </footer>
  );
};

export default Footer;
