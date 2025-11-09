// ✅ SafeStorage with memory fallback for browsers that block all storage (like Safari Private Mode)
let memoryStore = {};

export const safeStorage = {
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      console.warn("⚠️ localStorage.getItem blocked:", err.message);
      try {
        return sessionStorage.getItem(key);
      } catch {
        return memoryStore[key] || null;
      }
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.warn("⚠️ localStorage.setItem blocked:", err.message);
      try {
        sessionStorage.setItem(key, value);
      } catch {
        memoryStore[key] = value; // ✅ fallback in memory
      }
    }
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.warn("⚠️ localStorage.removeItem blocked:", err.message);
      try {
        sessionStorage.removeItem(key);
      } catch {
        delete memoryStore[key];
      }
    }
  },
};
