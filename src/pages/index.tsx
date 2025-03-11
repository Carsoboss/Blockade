/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import Head from "next/head";
import HeroSection from "../sections/hero";
import AboutLex3AISection from "../sections/lex3AI";
import FeaturesSection from "../sections/features";
import Footer from "../components/Footer";
import chessImage from "../../public/chess.svg";
import Navbar from "../components/navbar";

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
        <Navbar />
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
