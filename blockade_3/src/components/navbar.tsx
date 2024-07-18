import React, { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed z-50 w-full bg-gray-800 p-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="text-2xl font-bold text-white">
          Lex3
        </Link>
        <div className="hidden items-center space-x-4 md:flex">
          <Link
            href="/#features"
            className="block px-4 py-2 text-white hover:text-gray-400"
          >
            Features
          </Link>
          <Link href="/billing" className="text-white hover:text-gray-400">
            Billing
          </Link>
          <Link href="/ai/default" className="text-white hover:text-gray-400">
            Lex3AI
          </Link>
          <UserButton />
        </div>

        <div className="flex items-center md:hidden">
          <div className="px-4">
            <UserButton />
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-gray-300 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>
      {isOpen && (
        <div className="bg-gray-800 md:hidden">
          <Link
            href="/#features"
            className="block px-4 py-2 text-gray-400 hover:text-gray-300"
          >
            Features
          </Link>
          <Link
            href="/billing"
            className="block px-4 py-2 text-gray-400 hover:text-gray-300"
          >
            Billing
          </Link>
          <Link
            href="/ai/default"
            className="block px-4 py-2 text-gray-400 hover:text-gray-300"
          >
            Lex3AI
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
