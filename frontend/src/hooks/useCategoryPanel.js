import { useState } from 'react';

export function useCategoryPanel() {
  const [activeCategory, setActiveCategory] = useState(null);

  function toggleCategory(category) {
    setActiveCategory((current) => current === category ? null : category);
  }

  function handleCategoryKeyDown(event) {
    if (event.key === 'Escape') setActiveCategory(null);
  }

  return { activeCategory, toggleCategory, handleCategoryKeyDown };
}
