import React from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

const ExampleChat = () => {
  return (
    <div className="space-y-4 max-w-md mx-auto">
      {[
        {
          type: "user",
          content: "Olá! Como posso ajudar com projetos sustentáveis?",
          delay: 0,
        },
        {
          type: "agent",
          content: "Oi! Que bom que você quer saber mais sobre sustentabilidade!",
          delay: 1.5,
        },
      ].map((message, index) => (
        <motion.div
          key={index}
          className={`flex items-start gap-4 ${
            message.type === "agent" ? "flex-row-reverse" : ""
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: message.delay, duration: 0.5 }}
        >
          <motion.div
            className={`hidden md:flex text-white p-2 rounded-full shadow-lg ${
              message.type === "agent"
                ? "bg-gradient-to-br from-eda-orange to-eda-orange/80"
                : "bg-gradient-to-br from-eda-green to-eda-green/80"
            }`}
          >
            <MessageSquare size={20} />
          </motion.div>
          <motion.div
            className={`flex-1 p-4 rounded-xl shadow-sm ${
              message.type === "agent"
                ? "bg-gradient-to-br from-eda-orange/10 to-eda-orange/5"
                : "bg-gradient-to-br from-white to-gray-50"
            }`}
          >
            <p className="text-sm md:text-base">{message.content}</p>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default ExampleChat;