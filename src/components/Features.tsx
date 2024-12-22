import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { features } from "../config/content";

interface FeaturesProps {
  selectedFeature: number | null;
  onFeatureSelect: (featureId: number) => void;
}

const Features: React.FC<FeaturesProps> = ({
  selectedFeature,
  onFeatureSelect,
}) => {
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
          aria-label={`Select ${feature.title} feature`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="h-12 w-12 rounded-full bg-eda-orange/10 flex items-center justify-center">
            <span className="text-eda-orange text-xl">
              {feature.title.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-500">
              {feature.description}
            </p>
          </div>
          <div className="text-gray-400">
            <ArrowLeft className="h-5 w-5 rotate-180" />
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default Features;