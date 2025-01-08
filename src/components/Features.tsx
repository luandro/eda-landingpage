import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { features } from "../config/content";
import { useTranslation } from "react-i18next";

interface FeaturesProps {
  selectedFeature: number | null;
  onFeatureSelect: (featureId: number) => void;
}

const Features: React.FC<FeaturesProps> = ({
  selectedFeature,
  onFeatureSelect,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className="grid grid-cols-1 gap-3 max-w-2xl mx-auto"
      role="grid"
      aria-label="Features"
    >
      {features.map((feature) => (
        <motion.button
          key={feature.id}
          onClick={() => onFeatureSelect(feature.id)}
          className={`w-full p-4 rounded-lg text-left transition-colors flex items-center gap-4 shadow-sm ${
            selectedFeature === feature.id
              ? "bg-[#fff3e0]"
              : "bg-white hover:bg-gray-50"
          }`}
          aria-label={`Select ${t(`features.${feature.id}.title`)} feature`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="h-12 w-12 rounded-full bg-eda-orange/10 flex items-center justify-center">
            <span className="text-eda-orange text-xl">
              {t(`features.${feature.id}.title`).charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              {t(`features.${feature.id}.title`)}
            </h3>
            <p className="text-sm text-gray-500">
              {t(`features.${feature.id}.description`)}
            </p>
          </div>
          <div className="text-gray-400 md:hidden">
            <button 
              className="w-full px-6 py-3 text-center text-eda-orange bg-[#FFF3E0] rounded-full hover:bg-[#FFE4CC] transition-colors"
            >
              {t('common.select')}
            </button>
          </div>
          <div className="text-gray-400 hidden md:block">
            <Send className="h-5 w-5 rotate-180" />
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default Features;