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
    title: "Compliance Submission Form3",
  },
  {
    title: "Custom Compliance Bots",
  },
];

const AboutLex3AISection: React.FC = () => {
  return (
    <motion.section
      id="about"
      className="relative -mt-96 overflow-hidden bg-black p-8 text-white" // Made the section shorter
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <div className="relative z-10 mx-auto mt-24 max-w-7xl text-center">
        <h2 className="mb-8 text-4xl font-bold">ABOUT LEX3 AI</h2>{" "}
        {/* Reduced margin and font size */}
        <div className="relative h-64 w-full overflow-hidden">
          {" "}
          {/* Made the section shorter */}
          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-black via-transparent to-black" />
          <motion.div
            className="flex space-x-8"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 60, ease: "linear" }} // Slowed down to 60 seconds
          >
            {[...cards, ...cards].map((card, index) => (
              <motion.div
                key={index}
                className="relative flex h-32 w-96 flex-shrink-0 transform flex-col items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 p-4 text-center shadow-lg transition-transform hover:scale-105"
              >
                <div className="absolute inset-0 h-full w-full rounded-lg border-2 border-transparent transition-all duration-500 hover:border-blue-400" />
                <h3 className="text-xl font-bold text-blue-400">
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
