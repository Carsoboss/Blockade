/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// components/HeroSection.tsx
import React from "react";
import { motion } from "framer-motion";
import Image, { type StaticImageData } from "next/image";

interface HeroSectionProps {
  imageSrc: StaticImageData;
}

const HeroSection: React.FC<HeroSectionProps> = ({ imageSrc }) => {
  return (
    <section className="relative flex h-screen items-start justify-center bg-black">
      <div className="absolute top-0 z-0 h-full w-full overflow-hidden">
        <div
          className="relative h-full w-full"
          style={{ transform: "translateY(-25%)" }}
        >
          <Image
            src={imageSrc}
            alt="Chess"
            layout="fill"
            objectFit="cover"
            quality={100}
            className="opacity-30"
          />
        </div>
      </div>
      <motion.div
        className="z-10 mt-52 text-center" // Move the text up
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="mb-4 text-5xl font-bold">
          Own and Control Your Data with Lex3
        </h1>
        <p className="mb-8 text-2xl">
          Empowering compliance with advanced AI solutions.
        </p>
        <a
          href="#about"
          className="rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold hover:bg-blue-500"
        >
          Learn More
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
