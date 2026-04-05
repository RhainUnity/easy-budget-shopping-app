// src/components/Modals/PriceLookupModal/PriceLookupModal.jsx

import { useEffect, useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { fetchAveragePrice, submitSharedPrice } from "../../../utils/api";
import "./PriceLookupModal.css";

function PriceLookupModal({ isOpen, onClose, onUsePrice }) {
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupStatus, setLookupStatus] = useState("idle"); // idle | loading | error | done
  const [lookupError, setLookupError] = useState("");
  const [lookupResult, setLookupResult] = useState(null);

  // submit hooks
  const [submitBrand, setSubmitBrand] = useState("");
  const [submitCategory, setSubmitCategory] = useState("Other");
  const [submitPrice, setSubmitPrice] = useState("");
  const [submitUnit, setSubmitUnit] = useState("each");
  const [submitStore, setSubmitStore] = useState("Safeway");

  useEffect(() => {
    if (!isOpen) return;
    // reset each open
    setLookupQuery("");
    setLookupStatus("idle");
    setLookupError("");
    setLookupResult(null);

    setSubmitBrand("");
    setSubmitCategory("Other");
    setSubmitPrice("");
    setSubmitUnit("each");
    setSubmitStore("Safeway");
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

  const handleSubmitNewItem = async () => {
  try {
    if (!lookupQuery.trim() || !submitStore || !submitCategory || !submitPrice) {
      setLookupStatus("error");
      setLookupError("Please complete store, category, and price.");
      return;
    }

    const payload = {
      name: lookupQuery.trim(),
      brand: submitBrand.trim(),
      store: submitStore,
      category: submitCategory,
      price: Number(submitPrice),
      unit: submitUnit,
    };

    await submitSharedPrice(payload);

    setLookupStatus("done");
    setLookupError("");
    setLookupResult({
      name: payload.name,
      brand: payload.brand,
      store: payload.store,
      category: payload.category,
      price: payload.price,
      unit: payload.unit,
    });
  } catch (err) {
    setLookupStatus("error");
    setLookupError(err?.message || "Failed to add item to shared database");
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
  <>
    <p className="lookupmodal__error">{lookupError}</p>

    <div className="lookupmodal__card">
      <p className="lookupmodal__title">
        Add <strong>{lookupQuery}</strong> to shared database
      </p>

      <label className="lookupmodal__label">
        Brand
        <input
          className="lookupmodal__input"
          value={submitBrand}
          onChange={(e) => setSubmitBrand(e.target.value)}
          placeholder="Optional brand"
        />
      </label>

      <label className="lookupmodal__label">
        Store
        <select
          className="lookupmodal__input"
          value={submitStore}
          onChange={(e) => setSubmitStore(e.target.value)}
        >
          <option value="Safeway">Safeway</option>
          <option value="WinCo">WinCo</option>
          <option value="Albertsons">Albertsons</option>
          <option value="Fred Meyer">Fred Meyer</option>
        </select>
      </label>

      <label className="lookupmodal__label">
        Category
        <select
          className="lookupmodal__input"
          value={submitCategory}
          onChange={(e) => setSubmitCategory(e.target.value)}
        >
          <option value="Pantry">Pantry</option>
          <option value="Dairy">Dairy</option>
          <option value="Meat">Meat</option>
          <option value="Frozen">Frozen</option>
          <option value="Produce">Produce</option>
          <option value="Bakery">Bakery</option>
          <option value="Beverages">Beverages</option>
          <option value="Snacks">Snacks</option>
          <option value="Household">Household</option>
          <option value="Personal Care">Personal Care</option>
          <option value="Canned Goods">Canned Goods</option>
          <option value="Condiments">Condiments</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <label className="lookupmodal__label">
        Price
        <input
          className="lookupmodal__input"
          type="number"
          min="0"
          step="0.01"
          value={submitPrice}
          onChange={(e) => setSubmitPrice(e.target.value)}
          placeholder="Enter price"
        />
      </label>

      <label className="lookupmodal__label">
        Unit
        <select
          className="lookupmodal__input"
          value={submitUnit}
          onChange={(e) => setSubmitUnit(e.target.value)}
        >
          <option value="each">each</option>
          <option value="per lb">per lb</option>
          <option value="per dozen">per dozen</option>
          <option value="per gallon">per gallon</option>
          <option value="per loaf">per loaf</option>
        </select>
      </label>

      <button
        type="button"
        className="btn btn--primary btn--sm"
        onClick={handleSubmitNewItem}
        disabled={!lookupQuery.trim() || !submitStore || !submitCategory || !submitPrice}
      >
        Add this item to shared database
      </button>
    </div>
  </>
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
