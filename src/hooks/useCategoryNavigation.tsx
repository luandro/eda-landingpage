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
    setSelectedCategory(null);
    document.body.classList.remove("category-open");
    setTimeout(() => {
      onSectionChange(1);
    }, 100);
  }, [onSectionChange]);

  return {
    selectedCategory,
    handleCategorySelect,
    handleCategoryClose,
  };
};
