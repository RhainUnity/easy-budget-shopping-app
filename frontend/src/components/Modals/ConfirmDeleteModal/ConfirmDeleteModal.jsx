// src/components/Modals/ConfirmDeleteModal/ConfirmDeleteModal.jsx
import { useEffect } from "react";
import "./ConfirmDeleteModal.css";

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isBusy,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="confirmModal" onMouseDown={onClose} role="presentation">
      <div
        className="confirmModal__content"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Confirm delete"
      >
        <button
          type="button"
          className="confirmModal__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <h3 className="confirmModal__title">Permanently delete?</h3>

        <p className="confirmModal__text">
          This will permanently delete{" "}
          <strong>{itemName || "this item"}</strong>.
        </p>

        <div className="confirmModal__actions">
          <button
            type="button"
            className="btn btn--outline btn--sm confirmModal__btn"
            onClick={onClose}
            disabled={isBusy}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn--primary btn--sm confirmModal__btn confirmModal__btn_danger"
            onClick={onConfirm}
            disabled={isBusy}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
