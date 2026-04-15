// src/components/Modals/AddItemModal/AddItemModal.jsx

import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import PriceLookupModal from "../PriceLookupModal/PriceLookupModal";
import "./AddItemModal.css";

function AddItemModal({ isOpen, onClose, onSubmit, store, error }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Essential");
  const [unit, setUnit] = useState("each");
  const [brand, setBrand] = useState("");

  const [isLookupOpen, setIsLookupOpen] = useState(false);

  const resetForm = () => {
    // ** reset only when closing/submitting
    setName("");
    setPrice("");
    setCategory("");
    setPriority("Essential");
    setUnit("each");
    setBrand("");
    setIsLookupOpen(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatPriceForInput = (n) => {
    const num = Number(n);
    if (Number.isNaN(num)) return "";
    return num.toFixed(2);
  };

  const handleUseLookupPrice = (lookupResult) => {
    if (!lookupResult) return;

    setName(lookupResult.displayLabel || lookupResult.matchedKey || "");
    setPrice(formatPriceForInput(lookupResult.price));
    setUnit(lookupResult.unit || "each");

    const suggestedCategory =
      lookupResult.matchedKey === "milk" || lookupResult.matchedKey === "egg"
        ? "Dairy"
        : lookupResult.matchedKey === "chicken"
          ? "Meat"
          : "Pantry";

    setCategory((prev) => (prev ? prev : suggestedCategory));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedPrice = Number(price);
    if (!name.trim() || Number.isNaN(parsedPrice)) return;

    onSubmit({
      item: name.trim(),
      price: parsedPrice,
      unit: unit?.trim() || "each",
      category: category.trim() || "Pantry",
      priority: priority || "Essential",
      brand: brand.trim() || "",
    });

    resetForm();
  };

  return (
    <>
      <ModalWithForm
        title="Add Item"
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
      >
        <label className="addmodal__label">
          Item Name
          <input
            className="addmodal__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., milk"
            required
          />
        </label>

        <label className="addmodal__label">
          Brand (optional)
          <input
            className="addmodal__input"
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g., Kraft, Heinz, etc."
          />
        </label>

        <label className="addmodal__label">
          Item Price
          <input
            className="addmodal__input"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g., 4.10"
            required
          />
        </label>

        <label className="addmodal__label">
          Unit
          <select
            className="addmodal__input"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="each">each</option>
            <option value="per lb">per lb</option>
            <option value="per oz">per oz</option>
            <option value="per gal">per gal</option>
            <option value="per qt">per qt</option>
            <option value="per dozen">per dozen</option>
          </select>
        </label>

        <label className="addmodal__label">
          Item Priority
          <select
            className="addmodal__input"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Essential">Essential</option>
            <option value="Surplus">Surplus</option>
            <option value="Optional">Optional</option>
          </select>
        </label>

        <label className="addmodal__label">
          Item Category
          <select
            className="addmodal__input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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

        <label className="addmodal__label">
          Store
          <select className="addmodal__input" value={store} disabled>
            <option value="WinCo">WinCo</option>
            <option value="Safeway">Safeway</option>
            <option value="Albertson's">Albertson's</option>
          </select>
        </label>

        <button
          type="button"
          className="btn btn--outline addmodal__secondary"
          onClick={() => setIsLookupOpen(true)}
        >
          Lookup Price (API)
        </button>

        {/* ***Display error message if present (e.g., duplicate item error from backend)*** */}
        {error && <p className="addmodal__error">{error}</p>}

        <button className="btn btn--primary addmodal__submit" type="submit">
          Submit
        </button>
      </ModalWithForm>

      <PriceLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        onUsePrice={handleUseLookupPrice}
      />
    </>
  );
}

export default AddItemModal;
