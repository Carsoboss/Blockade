// components/FeaturesSection.tsx
import React from "react";
import { motion } from "framer-motion";
import { Lock, Search, Globe, FileText, User, Shield } from "lucide-react"; // Import Lucide icons

const features = [
  {
    title: "On-Chain Storage",
    description:
      "Secure and reliable data storage using blockchain technology.",
    icon: <Lock className="mx-auto h-10 w-10 text-blue-500" />, // Use Lucide icon
  },
  {
    title: "Data Integrity",
    description: "Ensuring the accuracy and consistency of your data.",
    icon: <Search className="mx-auto h-10 w-10 text-green-500" />, // Use Lucide icon
  },
  {
    title: "Interoperability",
    description: "Seamless integration across various blockchain platforms.",
    icon: <Globe className="mx-auto h-10 w-10 text-yellow-500" />, // Use Lucide icon
  },
  {
    title: "Smart Contracts",
    description:
      "Automated and self-executing contracts with predefined rules.",
    icon: <FileText className="mx-auto h-10 w-10 text-red-500" />, // Use Lucide icon
  },
  {
    title: "Digital Identity",
    description: "Secure and verifiable digital identities for users.",
    icon: <User className="mx-auto h-10 w-10 text-purple-500" />, // Use Lucide icon
  },
  {
    title: "Governance",
    description: "Decentralized and transparent governance mechanisms.",
    icon: <Shield className="mx-auto h-10 w-10 text-orange-500" />, // Use Lucide icon
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <motion.section
      id="features"
      className="bg-gray-900 p-16"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="mb-12 text-5xl font-bold">FEATURES</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="rounded-lg bg-gray-800 p-8 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="mb-4 text-3xl font-bold">{feature.title}</h3>
              <p className="text-xl">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturesSection;
