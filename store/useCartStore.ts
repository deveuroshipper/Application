import { getCartApiHandler } from "@/helper/Api";
import { create } from "zustand";

export type CartItem = {
  id?: string;
  orderid?: string;
  orderId?: string;
  [key: string]: any;
};

interface CartState {
  cartItems: CartItem[];
  cartCount: number;
  isLoading: boolean;
  setCartItems: (items: CartItem[]) => void;
  addCartItem: (item: CartItem) => void;
  removeCartItem: (id: string) => void;
  fetchCart: () => Promise<CartItem[]>;
  clearCart: () => void;
}

const matchesCartItemId = (item: CartItem, id: string) =>
  item.id === id || item.orderid === id || item.orderId === id;

export const useCartStore = create<CartState>()((set) => ({
  cartItems: [],
  cartCount: 0,
  isLoading: false,

  setCartItems: (cartItems) => {
    set({ cartItems, cartCount: cartItems.length });
  },

  addCartItem: (item) => {
    set((state) => {
      const exists = state.cartItems.some(
        (cartItem) =>
          (item.id && matchesCartItemId(cartItem, item.id)) ||
          (item.orderid && matchesCartItemId(cartItem, item.orderid)) ||
          (item.orderId && matchesCartItemId(cartItem, item.orderId)),
      );
      const cartItems = exists ? state.cartItems : [item, ...state.cartItems];

      return { cartItems, cartCount: cartItems.length };
    });
  },

  removeCartItem: (id) => {
    set((state) => {
      const cartItems = state.cartItems.filter(
        (item) => !matchesCartItemId(item, id),
      );

      return { cartItems, cartCount: cartItems.length };
    });
  },

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await getCartApiHandler();
      const cartItems = Array.isArray(response) ? response : [];
     
      set({ cartItems, cartCount: cartItems.length });

      return cartItems;
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: () => {
    set({ cartItems: [], cartCount: 0 });
  },
}));
