// src/utils/itemPayload.js

export function buildItemPayload(item, activeStore) {
  return {
    item: item.item,
    price: item.price,
    unit: item.unit,
    category: item.category,
    priority: item.priority,
    qty: item.qty ?? 0,
    hidden: item.hidden ?? false,
    store: item.store ?? activeStore,
  };
}
