import { create } from 'zustand';

type Product = {
  category: string;
  id: number;
  image: string;
  price: number;
  title: string;
};
export type CartItem = {
  product: Product;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: number) => void;
  addQuantity: (productId: number) => void;
  removeQuantity: (productId: number) => void;
};

// Create the cart store with Zustand
export const useCart = create<CartStore>((set, get) => ({
  items: [],
  addProduct: (product) =>
    set({ items: [...get().items, { product, quantity: 1 }] }),
  removeProduct: (productId: number) => {
    const { items } = get();
    set({ items: items.filter((item) => item.product.id !== productId) });
  },
  addQuantity: (productId) => {
    const { items } = get();
    let newArray = [...items];
    const itemToUpdate = items.findIndex(
      (item) => item.product.id === productId
    );
    if (itemToUpdate !== -1) {
      newArray[itemToUpdate].quantity += 1;
      set({ items: newArray });
    }
  },
  removeQuantity: (productId) => {
    const { items } = get();
    let newArray = [...items];
    const itemToUpdate = items.findIndex(
      (item) => item.product.id === productId
    );
    if (itemToUpdate !== -1) {
      newArray[itemToUpdate].quantity -= 1;
      if (newArray[itemToUpdate].quantity === 0) {
        newArray = newArray.filter((item) => item.product.id !== productId);
      }
      set({ items: newArray });
    }
  },
}));
