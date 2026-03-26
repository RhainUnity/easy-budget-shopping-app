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

      if (!result.found) {
        setLookupStatus("error");
        setLookupError("No shared price found");
        return;
      }

      setLookupResult(result.item);
      setLookupStatus("done");
    } catch (e) {
      setLookupStatus("error");
      setLookupError(
        e?.message || "No shared price found. You can add this item next.",
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
              Match: <strong>{lookupResult.name}</strong>
            </p>

            {lookupResult.brand && (
              <p className="lookupmodal__meta">Brand: {lookupResult.brand}</p>
            )}

            <p>
              Price:{" "}
              <strong>
                ${lookupResult.price.toFixed(2)}{" "}
                {lookupResult.unit ? `(${lookupResult.unit})` : ""}
              </strong>
            </p>

            <p className="lookupmodal__meta">Store: {lookupResult.store}</p>

            <p className="lookupmodal__meta">Source: Shared price database</p>
          </div>
        )}
      </div>
    </ModalWithForm>
  );
}

export default PriceLookupModal;
