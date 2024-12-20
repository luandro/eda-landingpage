import React from "react";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface ExampleChatProps {
  className?: string;
}

const ExampleChat: React.FC<ExampleChatProps> = ({ className }) => (
  <div
    className={`bg-black/5 rounded-lg p-6 h-[calc(100vh-200px)] flex flex-col justify-start ${className}`}
    role="region"
    aria-label="Chat example"
  >
    <motion.div
      className="flex items-start gap-4 mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="bg-eda-green text-white p-2 rounded-full"
        aria-hidden="true"
      >
        <MessageSquare size={20} />
      </div>
      <div
        className="flex-1 bg-white rounded-lg p-6 shadow-sm"
        role="article"
        aria-label="User message"
      >
        <p className="text-base leading-relaxed">
          Como posso ajudar a proteger o meio ambiente?
        </p>
      </div>
    </motion.div>

    <motion.div
      className="flex items-start gap-4 flex-row-reverse"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div
        className="bg-eda-orange text-white p-2 rounded-full"
        aria-hidden="true"
      >
        <MessageSquare size={20} />
      </div>
      <div
        className="flex-1 bg-eda-orange/10 rounded-lg p-6 shadow-sm"
        role="article"
        aria-label="Assistant response"
      >
        <p className="text-base leading-relaxed">
          Existem várias maneiras de proteger o meio ambiente! Você pode
          começar:
          <br />
          <br />
          • Reduzindo seu consumo de plástico
          <br />
          • Economizando água e energia
          <br />
          • Reciclando corretamente
          <br />• Apoiando iniciativas locais de conservação
        </p>
      </div>
    </motion.div>
  </div>
);

export default ExampleChat;
