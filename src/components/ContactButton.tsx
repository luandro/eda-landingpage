import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ContactButtonProps {
  icon: LucideIcon;
  label: string;
  href: string;
  color: string;
  external?: boolean;
}

const ContactButton: React.FC<ContactButtonProps> = ({
  icon: Icon,
  label,
  href,
  color,
  external = false,
}) => {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`flex justify-center items-center text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 ${color} hover:opacity-90 hover:scale-105 shadow-lg hover:shadow-xl`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="h-5 w-5 mr-3" />
      <span>{label}</span>
    </motion.a>
  );
};

export default ContactButton;