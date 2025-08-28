/* Data Manager: handles persistence and in-memory operations for items and offers */
(function () {
  const STORAGE_KEYS = {
    items: "gm_items",
    offers: "gm_offers",
  };

  function readFromStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to read from localStorage", key, e);
      return fallback;
    }
  }

  function writeToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Failed to write to localStorage", key, e);
    }
  }

  function generateId() {
    return (
      "id_" + Math.random().toString(36).slice(2) + Date.now().toString(36)
    );
  }

  const DataManager = {
    getItems() {
      return readFromStorage(STORAGE_KEYS.items, []);
    },
    saveItems(items) {
      writeToStorage(STORAGE_KEYS.items, items);
      document.dispatchEvent(
        new CustomEvent("items:changed", { detail: { items } })
      );
    },
    addItem(item) {
      const items = this.getItems();
      const newItem = Object.assign(
        { id: generateId(), price: 0, notes: "" },
        item
      );
      items.push(newItem);
      this.saveItems(items);
      return newItem;
    },
    updateItem(updated) {
      const items = this.getItems();
      const idx = items.findIndex((i) => i.id === updated.id);
      if (idx !== -1) {
        items[idx] = Object.assign({}, items[idx], updated);
        this.saveItems(items);
        return items[idx];
      }
      return null;
    },
    deleteItem(id) {
      const items = this.getItems().filter((i) => i.id !== id);
      this.saveItems(items);
    },
    getOffers() {
      return readFromStorage(STORAGE_KEYS.offers, []);
    },
    saveOffers(offers) {
      writeToStorage(STORAGE_KEYS.offers, offers);
      document.dispatchEvent(
        new CustomEvent("offers:changed", { detail: { offers } })
      );
    },
    addOffer(offer) {
      const offers = this.getOffers();
      const newOffer = Object.assign({ id: generateId() }, offer);
      offers.push(newOffer);
      this.saveOffers(offers);
      return newOffer;
    },
    deleteOffer(id) {
      const offers = this.getOffers().filter((o) => o.id !== id);
      this.saveOffers(offers);
    },
  };

  window.DataManager = DataManager;
})();
