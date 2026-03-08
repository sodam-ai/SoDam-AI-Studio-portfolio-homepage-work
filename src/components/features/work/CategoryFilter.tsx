import React from "react";
import { motion } from "framer-motion";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
}: Readonly<CategoryFilterProps>) {
  return (
    <div className="flex items-center space-x-2 pt-6 border-t border-white/5 overflow-x-auto scrollbar-hide pb-2 px-1">
      <div className="flex flex-nowrap gap-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`relative px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors duration-300 group ${
                isActive ? "text-black" : "text-white/40 hover:text-white"
              }`}
            >
              {/* Active Background Animation */}
              {isActive ? (
                <motion.div
                  layoutId="active-category-bg"
                  className="absolute inset-0 bg-white rounded-full z-0"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-white/5 scale-0 rounded-full z-0 group-hover:scale-100 transition-transform duration-300" />
              )}

              <span className="relative z-10">{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
