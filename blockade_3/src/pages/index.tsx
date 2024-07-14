/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import Head from "next/head";
import HeroSection from "../components/HeroSection";
import AboutLex3AISection from "../components/Lex3AISection";
import FeaturesSection from "../components/FeaturesSection";
import Footer from "../components/Footer";
import chessImage from "../../public/chess.svg";

const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Lex3</title>
        <meta
          name="description"
          content="Own and Control Your Data with On-Chain Storage"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col bg-gray-900 text-white">
        <header className="fixed z-50 w-full bg-gray-800 p-4">
          <nav className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="text-2xl font-bold">Lex3</div>
            <div className="space-x-4 px-6">
              <a href="#about" className="hover:text-gray-400">
                About
              </a>
              <a href="#features" className="hover:text-gray-400">
                Features
              </a>
              <a href="/ai" className="hover:text-gray-400">
                Lex3AI
              </a>
            </div>
          </nav>
        </header>

        <main className="mt-16 flex-1">
          <HeroSection imageSrc={chessImage} />
          <AboutLex3AISection />
          <FeaturesSection />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;
