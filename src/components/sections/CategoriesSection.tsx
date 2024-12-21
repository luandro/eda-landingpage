import React from "react";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ExampleChat from "../ExampleChat";
import { Button } from "@/components/ui/button";
import { categories } from "@/config/content";

interface CategoriesSectionProps {
  selectedCategory: number | null;
  onCategorySelect: (categoryId: number) => void;
  onCategoryClose: () => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  selectedCategory,
  onCategorySelect,
  onCategoryClose,
}) => {
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="relative w-full h-full">
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-500 ease-in-out ${
          selectedCategory !== null
            ? "opacity-0 -translate-x-full"
            : "opacity-100 translate-x-0"
        }`}
        role="grid"
        aria-label="Categories"
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`group p-8 bg-white/5 rounded-lg border-2 transition-all duration-300 text-left hover:shadow-lg ${
              selectedCategory === category.id
                ? "border-eda-green bg-eda-green/5"
                : "border-gray-200 hover:border-eda-green"
            }`}
            aria-label={`Select ${category.title} category`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-eda-green mb-2 group-hover:translate-x-2 transition-transform">
                {category.title}
              </h3>
              <motion.div
                className="text-eda-green opacity-0 group-hover:opacity-100"
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowLeft className="transform rotate-180" size={20} />
              </motion.div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {category.description}
            </p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedCategory !== null && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 category-transition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCategoryClose}
            />
            <motion.div
              className="fixed inset-0 bg-white z-50 touch-pan-x category-transition"
              role="dialog"
              aria-modal="true"
              aria-label="Chat interface"
              initial="category-enter"
              animate="category-enter-active"
              exit="category-exit-active"
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe > swipeConfidenceThreshold || offset.x > 100) {
                  onCategoryClose();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape" || e.key === "ArrowLeft") {
                  onCategoryClose();
                }
              }}
              tabIndex={0}
            >
              <div className="h-full max-h-screen overflow-hidden">
                <motion.div
                  className="fixed top-4 left-4 z-10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    onClick={onCategoryClose}
                    className="group flex items-center text-eda-green hover:text-eda-green/80 transition-all duration-300 category-transition"
                    aria-label="Back to categories"
                  >
                    <ArrowLeft className="mr-2 transition-transform group-hover:-translate-x-2" />
                    <span className="font-medium">Voltar</span>
                  </Button>
                </motion.div>

                <motion.div
                  className="pt-16 px-4 h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <ExampleChat className="max-w-4xl mx-auto" />
                </motion.div>

                <motion.div
                  className="fixed bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 flex items-center gap-2 pointer-events-none select-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    delay: 1,
                    duration: 2,
                    times: [0, 0.5, 1],
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  <ArrowLeft size={16} />
                  <span className="text-sm">Deslize para voltar</span>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoriesSection;
