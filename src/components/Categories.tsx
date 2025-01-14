import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { categories } from "../config/content";
import { useTranslation } from "react-i18next";

interface CategoriesProps {
  selectedCategory: number | null;
  onCategorySelect: (categoryId: number) => void;
}

const Categories: React.FC<CategoriesProps> = ({
  selectedCategory,
  onCategorySelect,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className="grid grid-cols-1 gap-3 max-w-2xl mx-auto"
      role="grid"
      aria-label="Categories"
    >
      {categories.map((category) => (
        <motion.button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className={`w-full p-4 rounded-lg text-left transition-colors flex items-center gap-4 shadow-sm ${
            selectedCategory === category.id
              ? "bg-[#e8f5e9]"
              : "bg-white hover:bg-gray-50"
          }`}
          aria-label={`Select ${t(`categories.${category.id}.title`)} category`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="h-12 w-12 rounded-full bg-eda-green/10 flex items-center justify-center">
            <span className="text-eda-green text-xl">
              {t(`categories.${category.id}.title`).charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              {t(`categories.${category.id}.title`)}
            </h3>
            <p className="text-sm text-gray-500">
              {t(`categories.${category.id}.description`)}
            </p>
          </div>
          <div className="text-gray-400 md:hidden">
            <button 
              className="w-full px-6 py-3 text-center text-eda-green bg-[#F2FCE2] rounded-full hover:bg-[#E5F5D5] transition-colors"
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

export default Categories;