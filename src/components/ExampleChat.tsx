import React from 'react';

interface ExampleChatProps {
  className?: string;
}

const ExampleChat: React.FC<ExampleChatProps> = ({ className }) => {
  return (
    <div className={className}>
      <div className="bg-gray-100 rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
              <p className="text-gray-800">Como posso ajudar a proteger o meio ambiente?</p>
            </div>
          </div>
          <div className="flex items-start justify-end">
            <div className="bg-eda-green p-3 rounded-lg shadow-sm max-w-[80%]">
              <p className="text-white">
                Existem várias maneiras de contribuir! Você pode começar com pequenas ações diárias como:
                <br />- Reduzir o consumo de plástico
                <br />- Economizar água e energia
                <br />- Reciclar corretamente
                <br />- Apoiar produtos sustentáveis
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
              <p className="text-gray-800">Quais são os principais problemas ambientais da minha região?</p>
            </div>
          </div>
          <div className="flex items-start justify-end">
            <div className="bg-eda-green p-3 rounded-lg shadow-sm max-w-[80%]">
              <p className="text-white">
                Posso ajudar você a identificar os desafios ambientais da sua região e sugerir ações específicas para endereçá-los. Vamos trabalhar juntos para criar um impacto positivo na sua comunidade!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleChat;