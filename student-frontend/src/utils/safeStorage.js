// ✅ SafeStorage v2 — Silent, stable fallback for all browsers (even Safari private mode)
let memoryStore = {};

function canUseStorage() {
  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const storageAvailable = canUseStorage();

export const safeStorage = {
  getItem(key) {
    if (storageAvailable) {
      return localStorage.getItem(key);
    }
    return memoryStore[key] || null;
  },
  setItem(key, value) {
    if (storageAvailable) {
      localStorage.setItem(key, value);
    } else {
      memoryStore[key] = value;
    }
  },
  removeItem(key) {
    if (storageAvailable) {
      localStorage.removeItem(key);
    } else {
      delete memoryStore[key];
    }
  },
};
