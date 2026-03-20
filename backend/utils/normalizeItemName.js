function normalizeItemName(name = "") {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

module.exports = normalizeItemName;
