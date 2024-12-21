import { useState, useCallback } from "react";

export const useCategoryNavigation = (
  onSectionChange: (index: number) => void,
) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const handleCategorySelect = useCallback((categoryId: number) => {
    setSelectedCategory(categoryId);
    document.body.classList.add("category-open");
  }, []);

  const handleCategoryClose = useCallback(() => {
    const cleanup = () => {
      document.body.classList.remove("category-open");
      setSelectedCategory(null);
      onSectionChange(1);
    };

    // Add exit animation class
    document.body.classList.add("category-exit");

    // Wait for animation to complete
    const element = document.querySelector(".category-transition");
    if (element) {
      element.addEventListener("animationend", () => {
        document.body.classList.remove("category-exit");
        cleanup();
      }, { once: true });
    } else {
      cleanup();
    }
  }, [onSectionChange]);

  return {
    selectedCategory,
    handleCategorySelect,
    handleCategoryClose,
  };
};
