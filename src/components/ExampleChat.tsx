import React from "react";
import { MessageSquare } from "lucide-react";

const ExampleChat = () => (
  <div className="bg-black/5 rounded-lg p-6 space-y-4 h-[400px] md:h-[600px] overflow-y-auto">
    <div className="flex items-start gap-4">
      <div className="bg-eda-green text-white p-2 rounded-full">
        <MessageSquare size={20} />
      </div>
      <div className="flex-1 bg-white rounded-lg p-4 shadow-sm">
        <p className="text-sm">Como posso ajudar a proteger o meio ambiente?</p>
      </div>
    </div>
    <div className="flex items-start gap-4 flex-row-reverse">
      <div className="bg-eda-orange text-white p-2 rounded-full">
        <MessageSquare size={20} />
      </div>
      <div className="flex-1 bg-eda-orange/10 rounded-lg p-4 shadow-sm">
        <p className="text-sm">
          Existem várias maneiras de proteger o meio ambiente! Você pode começar
          reduzindo seu consumo de plástico, economizando água e energia,
          reciclando corretamente, e apoiando iniciativas locais de conservação.
        </p>
      </div>
    </div>
  </div>
);

export default ExampleChat;
