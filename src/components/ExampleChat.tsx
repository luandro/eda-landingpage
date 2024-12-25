import React from "react";
import { motion } from "framer-motion";

const ExampleChat = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
      <div className="space-y-4">
        {[
          { text: "Olá! Como posso ajudar?", isBot: true },
          { text: "Quero saber mais sobre os cursos", isBot: false },
          { text: "Claro! Temos vários cursos disponíveis", isBot: true },
        ].map((message, index) => (
          <motion.div
            key={index}
            className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.5 }}
          >
            <div
              className={`flex items-start gap-2 max-w-[80%] ${
                message.isBot ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div
                className={`hidden sm:flex h-8 w-8 rounded-full items-center justify-center ${
                  message.isBot ? "bg-eda-green/10" : "bg-eda-orange/10"
                }`}
              >
                <span
                  className={`text-sm ${
                    message.isBot ? "text-eda-green" : "text-eda-orange"
                  }`}
                >
                  {message.isBot ? "Ê" : "U"}
                </span>
              </div>
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.isBot
                    ? "bg-gray-100 text-gray-800"
                    : "bg-eda-orange text-white"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExampleChat;