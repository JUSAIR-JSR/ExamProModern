// ✅ safeStorage.js
export const safeStorage = {
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      console.warn("⚠️ safeStorage.getItem blocked:", err.message);
      return null;
    }
  },

  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.warn("⚠️ safeStorage.setItem blocked:", err.message);
    }
  },

  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.warn("⚠️ safeStorage.removeItem blocked:", err.message);
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (err) {
      console.warn("⚠️ safeStorage.clear blocked:", err.message);
    }
  },
};
