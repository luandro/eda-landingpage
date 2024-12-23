import { useState, useCallback } from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const useCategoryNavigation = (
  onSectionChange: (index: number) => void,
) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const categoryId = location.pathname.match(/\/category\/(\d+)/)?.[1];
    const parsedId = categoryId ? parseInt(categoryId) : null;

    if (parsedId) {
      setSelectedCategory(parsedId);
    } else {
      setSelectedCategory(null);
    }
  }, [location]);

  const handleCategorySelect = useCallback(
    (categoryId: number) => {
      navigate(`/category/${categoryId}`);
      setSelectedCategory(categoryId);
    },
    [navigate],
  );

  const handleCategoryClose = useCallback(() => {
    navigate("/");
    setSelectedCategory(null);
    onSectionChange(1);
  }, [navigate, onSectionChange]);

  return {
    selectedCategory,
    handleCategorySelect,
    handleCategoryClose,
  };
};
