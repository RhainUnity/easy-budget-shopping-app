function normalizeBrandName(brand = "") {
  return brand.trim().toLowerCase().replace(/\s+/g, " ");
}

module.exports = normalizeBrandName;
