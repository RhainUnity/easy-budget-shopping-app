import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./EditPriceModal.css";

function EditPriceModal({
  isOpen,
  item,
  priceValue,
  unitValue,
  onPriceChange,
  onUnitChange,
  onSave,
  onClose,
}) {
  if (!item) return null;

  return (
    <ModalWithForm
      title={`Edit Price - ${item.item}`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <label className="editprice__label">
        Price
        <input
          className="editprice__input"
          type="number"
          min="0"
          step="0.01"
          value={priceValue}
          onChange={(e) => onPriceChange(e.target.value)}
          placeholder="Enter price"
        />
      </label>

      <label className="editprice__label">
        Unit
        <select
          className="editprice__input"
          value={unitValue}
          onChange={(e) => onUnitChange(e.target.value)}
        >
          <option value="each">each</option>
          <option value="per lb">per lb</option>
          <option value="per dozen">per dozen</option>
          <option value="per gallon">per gallon</option>
          <option value="per loaf">per loaf</option>
        </select>
      </label>

      <div className="editprice__actions">
        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={onSave}
          disabled={priceValue === ""}
        >
          Save
        </button>
      </div>
    </ModalWithForm>
  );
}

export default EditPriceModal;