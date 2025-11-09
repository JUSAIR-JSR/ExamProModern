import Cookies from "js-cookie";

let memoryStore = {};

function canUseStorage() {
  try {
    const testKey = "__test__";
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
    try {
      if (storageAvailable) {
        return localStorage.getItem(key) || Cookies.get(key) || null;
      }
      return memoryStore[key] || Cookies.get(key) || null;
    } catch {
      return Cookies.get(key) || null;
    }
  },

  setItem(key, value) {
    try {
      if (storageAvailable) {
        localStorage.setItem(key, value);
      } else {
        memoryStore[key] = value;
      }
      Cookies.set(key, value, { expires: 7 }); // ✅ cookie fallback (7 days)
    } catch {
      Cookies.set(key, value, { expires: 7 });
    }
  },

  removeItem(key) {
    try {
      if (storageAvailable) localStorage.removeItem(key);
      else delete memoryStore[key];
      Cookies.remove(key);
    } catch {
      Cookies.remove(key);
    }
  },
};
