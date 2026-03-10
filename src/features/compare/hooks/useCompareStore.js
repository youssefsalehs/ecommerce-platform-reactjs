import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
export const useCompareStore = create(
  // presist comparing items so if the page is reloaded it's stored in local storage
  persist(
    (set) => ({
      selectedProductA: "",
      selectedProductB: "",
      // Used to determine which product should be replaced (the older)
      timestamps: { A: 0, B: 0 },

      // Adds a product to the comparison list used for products card or product details as they are not in comparePage
      // Only two products can be compared at the same time
      selectProduct: (id) =>
        set((state) => {
          const { selectedProductA, selectedProductB, timestamps } = state;

          if (id === selectedProductA || id === selectedProductB) return state;

          const now = Date.now();

          if (!selectedProductA)
            return {
              selectedProductA: id,
              timestamps: { ...timestamps, A: now },
            };
          if (!selectedProductB)
            return {
              selectedProductB: id,
              timestamps: { ...timestamps, B: now },
            };

          if (timestamps.A <= timestamps.B) {
            return {
              selectedProductA: id,
              timestamps: { ...timestamps, A: now },
            };
          } else {
            return {
              selectedProductB: id,
              timestamps: { ...timestamps, B: now },
            };
          }
        }),
      disSelectProduct: (id) =>
        set((state) => {
          const { selectedProductA, selectedProductB, timestamps } = state;
          if (id === selectedProductA)
            return { selectedProductA: "", timestamps };
          if (id === selectedProductB)
            return { selectedProductB: "", timestamps };
        }),
      setSelectedProductA: (id) =>
        set((state) => {
          const now = Date.now();
          if (!id) return { selectedProductA: "" };
          if (state.selectedProductB === id) return state;
          return {
            selectedProductA: id,
            timestamps: { ...state.timestamps, A: now },
          };
        }),

      setSelectedProductB: (id) =>
        set((state) => {
          const now = Date.now();
          if (!id) return { selectedProductB: "" };
          if (state.selectedProductA === id) return state;
          return {
            selectedProductB: id,
            timestamps: { ...state.timestamps, B: now },
          };
        }),
      clearSelection: () => set({ selectedProductA: "", selectedProductB: "" }),
    }),
    {
      name: "compare-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
