import React from "react";
import { motion } from "framer-motion";

const DividingLine: React.FC = () => {
  return (
    <motion.div
      className="absolute pointer-events-none md:w-px md:h-full w-full h-px 
                 bg-gradient-to-r md:bg-gradient-to-b from-transparent via-gray-300 to-transparent
                 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
};

export default DividingLine;