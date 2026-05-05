import { DEFAULT_PRODUCTS, SHOP_DATA_VERSION } from '../data/shopProducts';

const SHOP_KEY = 'livecare_shop_products';
const SHOP_VERSION_KEY = 'livecare_shop_products_version';
const WAITLIST_KEY = 'livecare_waitlist_entries';
const ADMIN_AUTH_KEY = 'livecare_admin_authenticated';

function parseJSON(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function getShopProducts() {
  const storedVersion = localStorage.getItem(SHOP_VERSION_KEY);
  if (storedVersion !== SHOP_DATA_VERSION) {
    localStorage.setItem(SHOP_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    localStorage.setItem(SHOP_VERSION_KEY, SHOP_DATA_VERSION);
    return DEFAULT_PRODUCTS;
  }

  const stored = parseJSON(localStorage.getItem(SHOP_KEY), null);
  if (!Array.isArray(stored) || stored.length === 0) {
    localStorage.setItem(SHOP_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    localStorage.setItem(SHOP_VERSION_KEY, SHOP_DATA_VERSION);
    return DEFAULT_PRODUCTS;
  }

  return stored.map((product) => ({
    ...product,
    modelName: product.modelName || null,
    availability: product.availability || 'In stock',
    images: Array.isArray(product.images) ? product.images : [],
  }));
}

export function saveShopProducts(products) {
  localStorage.setItem(SHOP_KEY, JSON.stringify(products));
  localStorage.setItem(SHOP_VERSION_KEY, SHOP_DATA_VERSION);
}

export function addShopProduct(product) {
  const products = getShopProducts();
  const next = [...products, product];
  saveShopProducts(next);
  return next;
}

export function updateProductImages(productId, nextImages) {
  const products = getShopProducts().map(product => {
    if (product.id !== productId) return product;
    return { ...product, images: nextImages };
  });
  saveShopProducts(products);
  return products;
}

export function getWaitlistEntries() {
  const entries = parseJSON(localStorage.getItem(WAITLIST_KEY), []);
  return Array.isArray(entries) ? entries : [];
}

export function addWaitlistEntry(entry) {
  const current = getWaitlistEntries();
  const nextEntry = {
    id: `${Date.now()}_${Math.floor(Math.random() * 100000)}`,
    submittedAt: new Date().toISOString(),
    ...entry,
  };
  const next = [nextEntry, ...current];
  localStorage.setItem(WAITLIST_KEY, JSON.stringify(next));
  return nextEntry;
}

export function deleteWaitlistEntry(entryId) {
  const filtered = getWaitlistEntries().filter(entry => entry.id !== entryId);
  localStorage.setItem(WAITLIST_KEY, JSON.stringify(filtered));
  return filtered;
}

export function isAdminAuthenticated() {
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

export function setAdminAuthenticated(value) {
  if (value) {
    sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
    return;
  }
  sessionStorage.removeItem(ADMIN_AUTH_KEY);
}
