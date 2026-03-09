import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useWishlistStore = create(
  // presist wishlist items so if the page is reloaded it's stored in local storage
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product) => {
        const items = get().items;
        const exists = items.find((item) => item.id === product.id);
        if (exists) return;
        set({ items: [...items, product] });
      },

      removeFromWishlist: (productId) => {
        //Implementation of removal logic
        const items = get().items;
        const filteredItems = items.filter((item) => item.id !== productId);
        set({ items: filteredItems });
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
    }),
    {
      name: "wishlist",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useWishlistStore;
