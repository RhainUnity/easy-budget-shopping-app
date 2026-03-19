// src/components/Modals/PriceLookupModal/PriceLookupModal.jsx

import { useEffect, useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { fetchAveragePrice } from "../../../utils/api";
import "./PriceLookupModal.css";

function PriceLookupModal({ isOpen, onClose, onUsePrice }) {
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupStatus, setLookupStatus] = useState("idle"); // idle | loading | error | done
  const [lookupError, setLookupError] = useState("");
  const [lookupResult, setLookupResult] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    // reset each open
    setLookupQuery("");
    setLookupStatus("idle");
    setLookupError("");
    setLookupResult(null);
  }, [isOpen]);

  const handleLookupSearch = async () => {
    try {
      setLookupStatus("loading");
      setLookupError("");
      setLookupResult(null);

      const result = await fetchAveragePrice(lookupQuery);

      setLookupResult({
        matchedKey: result.item,
        displayLabel: result.label || result.item,
        seriesId: result.seriesId,
        price: result.price,
        unit: result.unit || "each",
        periodName: result.month,
        year: result.year,
      });

      setLookupStatus("done");
    } catch (e) {
      setLookupStatus("error");

      setLookupError(
        e?.message ||
          "No match yet. Try: banana, milk (we’ll add more items soon).",
      );

      setLookupResult(null);
    }
  };

  const handleUse = () => {
    if (!lookupResult) return;
    onUsePrice?.(lookupResult); // ** send result to AddItemModal
    onClose();
  };

  return (
    <ModalWithForm title="Price Lookup" isOpen={isOpen} onClose={onClose}>
      <label className="lookupmodal__label">
        Search Item
        <input
          className="lookupmodal__input"
          value={lookupQuery}
          onChange={(e) => setLookupQuery(e.target.value)}
          placeholder="e.g., milk, banana, eggs, rice"
        />
      </label>

      <div className="lookupmodal__actions">
        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={handleLookupSearch}
          disabled={!lookupQuery.trim() || lookupStatus === "loading"}
        >
          {lookupStatus === "loading" ? "Searching..." : "Search"}
        </button>

        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={handleUse}
          disabled={!lookupResult}
        >
          Use Price
        </button>
      </div>

      <div className="lookupmodal__results">
        {lookupStatus === "error" && (
          <p className="lookupmodal__error">{lookupError}</p>
        )}

        {lookupStatus === "idle" && (
          <p className="lookupmodal__hint">
            Try: <strong>banana</strong>, <strong>milk</strong>,{" "}
            <strong>eggs</strong>, <strong>rice</strong>. (More items soon.)
          </p>
        )}

        {lookupResult && (
          <div className="lookupmodal__card">
            <p className="lookupmodal__title">
              Match: <strong>{lookupResult.displayLabel}</strong>
            </p>
            <p>
              Avg price:{" "}
              <strong>
                ${lookupResult.price.toFixed(2)}{" "}
                {lookupResult.unit ? `(${lookupResult.unit})` : ""}
              </strong>
            </p>
            <p className="lookupmodal__meta">
              Source: BLS Average Price ({lookupResult.periodName}{" "}
              {lookupResult.year})
            </p>
          </div>
        )}
      </div>
    </ModalWithForm>
  );
}

export default PriceLookupModal;
