// src/components/Modals/ModalWithForm/ModalWithForm.jsx

import { useEffect } from "react";
import "./ModalWithForm.css";

function ModalWithForm({ title, isOpen, onClose, children, onSubmit }) {
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
    <div className="modal" onMouseDown={onClose}>
      <div className="modal__content" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal__close" type="button" onClick={onClose}>
          ✕
        </button>
        <h2 className="modal__title">{title}</h2>

        <form className="modal__form" onSubmit={onSubmit}>
          {" "}
          {children}
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;
