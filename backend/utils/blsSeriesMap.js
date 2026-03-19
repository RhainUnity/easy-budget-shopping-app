const BLS_SERIES_MAP = {
  banana: { label: "Bananas", seriesId: "APU0000711211", unit: "per lb" },
  milk: { label: "Milk", seriesId: "APU0000709112", unit: "per gal" },
  egg: { label: "Eggs", seriesId: "APU0000708111", unit: "per dozen" },
  bread: { label: "Bread", seriesId: "APU0000702111", unit: "each" },
};

const STOP_WORDS = ["whole", "large", "brown", "white", "fresh", "organic"];

function normalizeQuery(query) {
  let q = query.toLowerCase().trim();

  // remove punctuation
  q = q.replace(/[^\w\s]/g, "");

  // split words
  let words = q.split(/\s+/);

  // remove descriptive words
  words = words.filter((w) => !STOP_WORDS.includes(w));

  // convert plurals -> singular (very basic)
  words = words.map((w) => (w.endsWith("s") ? w.slice(0, -1) : w));

  return words;
}

function resolveSeriesId(query) {
  const words = normalizeQuery(query);

  // direct match
  for (const word of words) {
    if (BLS_SERIES_MAP[word]) {
      return { key: word, ...BLS_SERIES_MAP[word] };
    }
  }

  // fallback substring match
  const keys = Object.keys(BLS_SERIES_MAP);

  for (const key of keys) {
    if (words.includes(key)) {
      return { key, ...BLS_SERIES_MAP[key] };
    }
  }

  return null;
}

module.exports = {
  resolveSeriesId,
};
