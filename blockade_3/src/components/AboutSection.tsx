// components/AboutSection.tsx
import React from "react";
import { motion } from "framer-motion";

const AboutSection: React.FC = () => {
  return (
    <motion.section
      id="about"
      className="bg-gray-800 p-16"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="mb-12 text-5xl font-bold">ABOUT</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <motion.img
              src="/images/about1.jpg"
              alt="About 1"
              className="rounded-lg shadow-lg"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            />
            <p className="mt-4 text-xl">
              Own and control your data with on-chain storage. Our
              Ethereum-based blockchain ensures data integrity and privacy.
            </p>
          </div>
          <div>
            <motion.img
              src="/images/about2.jpg"
              alt="About 2"
              className="rounded-lg shadow-lg"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            />
            <p className="mt-4 text-xl">
              Standards like ERC 721 (NFTs) and ERC 6551 (Individual NFT Smart
              Contracts) provide transparency and interoperability, ensuring
              your digital experience is as strategic and precise as a
              well-played game of chess.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
