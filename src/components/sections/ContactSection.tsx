import React from "react";
import { Mail, Phone, Globe, Github } from "lucide-react";
import { motion } from "framer-motion";
import { contactInfo, organizations } from "@/config/content";

const ContactSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-eda-green mb-6">
          Entre em Contato
        </h2>
        <div className="space-y-4">
          <a
            href={`mailto:${contactInfo.email}`}
            className="flex items-center space-x-3 text-gray-600 hover:text-eda-green transition-colors"
          >
            <Mail className="h-5 w-5" />
            <span>{contactInfo.email}</span>
          </a>
          <a
            href={`tel:${contactInfo.phone}`}
            className="flex items-center space-x-3 text-gray-600 hover:text-eda-green transition-colors"
          >
            <Phone className="h-5 w-5" />
            <span>{contactInfo.phone}</span>
          </a>
          <a
            href={`https://${contactInfo.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 text-gray-600 hover:text-eda-green transition-colors"
          >
            <Globe className="h-5 w-5" />
            <span>{contactInfo.website}</span>
          </a>
          <a
            href={contactInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 text-gray-600 hover:text-eda-green transition-colors"
          >
            <Github className="h-5 w-5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>

      <div className="space-y-8 animate-fade-in delay-200">
        <h2 className="text-3xl font-bold text-eda-green mb-6">
          Agradecimentos
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full" />
              <h3 className="text-lg font-semibold text-center mb-2">
                {org.name}
              </h3>
              <p className="text-sm text-gray-600 text-center">
                {org.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
