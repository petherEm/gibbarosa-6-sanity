import { create } from 'zustand';

interface FiltersState {
  selectedCategory: string | null;
  selectedCollection: string | null;
  priceRange: { min: number; max: number };
  setCategory: (category: string | null) => void;
  setCollection: (collection: string | null) => void;
  setPriceRange: (range: { min: number; max: number }) => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  selectedCategory: null,
  selectedCollection: null,
  priceRange: { min: 0, max: 1000 },
  setCategory: (category) => set({ selectedCategory: category }),
  setCollection: (collection) => set({ selectedCollection: collection }),
  setPriceRange: (range) => set({ priceRange: range }),
  resetFilters: () => set({
    selectedCategory: null,
    selectedCollection: null,
    priceRange: { min: 0, max: 1000 }
  })
}));
