import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ExampleChat from "../components/ExampleChat";
import { Button } from "@/components/ui/button";
import { categories } from "@/config/content";

const Category = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const category = categories.find((c) => c.id === Number(id));

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="overlay"
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={() => navigate(-1)}
      />
      <motion.div
        key="content"
        className="fixed inset-0 bg-white z-50"
        role="dialog"
        aria-modal="true"
        aria-label="Category interface"
        onKeyDown={(e) => {
          if (e.key === "Escape" || e.key === "ArrowLeft") {
            navigate(-1);
          }
        }}
        tabIndex={0}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, { offset, velocity }) => {
          const swipe = swipePower(offset.x, velocity.x);
          if (swipe < -swipeConfidenceThreshold) {
            navigate(-1);
          }
        }}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
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
              onClick={() => navigate(-1)}
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
            <div className="max-w-4xl mx-auto">
              <motion.h1
                className="text-3xl font-bold mb-6 text-eda-green"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {category?.title || `Categoria ${id}`}
              </motion.h1>
              <ExampleChat className="max-w-4xl mx-auto" />
            </div>
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
    </AnimatePresence>
  );
};

export default Category;
