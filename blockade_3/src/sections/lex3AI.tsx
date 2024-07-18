/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// components/AboutLex3AISection.tsx
import React from "react";
import { motion } from "framer-motion";

const cards = [
  {
    title: "Compliance Automated Technology Bot",
  },
  {
    title: "Streamlined User Experience",
  },
  {
    title: "Compliance Submission Form",
  },
  {
    title: "Custom Compliance Bots",
  },
];

const AboutLex3AISection: React.FC = () => {
  return (
    <motion.section
      id="about"
      className="relative -mt-80 overflow-hidden bg-black p-4 text-white" // Reduced padding
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <div className="relative z-10 mx-auto mt-12 max-w-7xl text-center">
        <h2 className="mb-4 text-4xl font-bold">LEX3 AI</h2>{" "}
        {/* Adjusted margin and font size */}
        <div className="relative h-40 w-full overflow-hidden">
          {" "}
          {/* Reduced height */}
          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-black via-transparent to-black" />
          <motion.div
            className="flex space-x-4" // Reduced space between cards
            animate={{ x: ["0%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
          >
            {[...cards, ...cards].map((card, index) => (
              <motion.div
                key={index}
                className="relative flex h-24 w-64 flex-shrink-0 transform flex-col items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 p-2 text-center shadow-lg transition-transform hover:scale-105"
              >
                {" "}
                {/* Reduced card size */}
                <div className="absolute inset-0 h-full w-full rounded-lg border-2 border-transparent transition-all duration-500 hover:border-blue-400" />
                <h3 className="text-base font-bold text-blue-400">
                  {card.title}
                </h3>{" "}
                {/* Adjusted font size */}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutLex3AISection;
