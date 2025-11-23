export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: string;
  priceNumeric: number;
  quantity: number;
  image: string;
}

export interface FavoriteItem {
  id: string;
  name: string;
  slug: string;
  price: string;
  priceNumeric: number;
  image: string;
}

export interface ActiveOrder {
  orderId: string;
  orderDate: string;
  customer: {
    name: string;
    phone: string;
    contactMethod: string;
    deliveryDate: string;
    deliveryTime: string;
    address: string;
    comment?: string;
  };
  cart: CartItem[];
  total: number;
}

// Корзина
export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const getCartItem = (id: string): CartItem | undefined => {
  return getCart().find(item => item.id === id);
};

export const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
  const cart = getCart();
  const existingItem = cart.find(i => i.id === item.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...item, quantity });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
};

export const removeFromCart = (id: string) => {
  const cart = getCart().filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
};

export const updateCartQuantity = (id: string, quantity: number) => {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity = Math.max(1, quantity);
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  }
};

export const clearCart = () => {
  localStorage.removeItem('cart');
  window.dispatchEvent(new Event('cartUpdated'));
};

export const getCartTotal = (): number => {
  return getCart().reduce((sum, item) => sum + (item.priceNumeric * item.quantity), 0);
};

export const getCartCount = (): number => {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
};

// Активный заказ
export const setActiveOrder = (order: ActiveOrder) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('activeOrder', JSON.stringify(order));
  window.dispatchEvent(new Event('orderUpdated'));
};

export const getActiveOrder = (): ActiveOrder | null => {
  if (typeof window === 'undefined') return null;
  const order = localStorage.getItem('activeOrder');
  return order ? JSON.parse(order) : null;
};

export const clearActiveOrder = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('activeOrder');
  window.dispatchEvent(new Event('orderUpdated'));
};

// Избранное
export const getFavorites = (): FavoriteItem[] => {
  if (typeof window === 'undefined') return [];
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
};

export const addToFavorites = (item: FavoriteItem) => {
  const favorites = getFavorites();
  if (!favorites.find(i => i.id === item.id)) {
    favorites.push(item);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    window.dispatchEvent(new Event('favoritesUpdated'));
  }
};

export const removeFromFavorites = (id: string) => {
  const favorites = getFavorites().filter(item => item.id !== id);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  window.dispatchEvent(new Event('favoritesUpdated'));
};

export const isFavorite = (id: string): boolean => {
  return getFavorites().some(item => item.id === id);
};

export const getFavoritesCount = (): number => {
  return getFavorites().length;
};
