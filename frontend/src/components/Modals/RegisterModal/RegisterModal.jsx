// src/components/Modals/RegisterModal/RegisterModal.jsx
import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./RegisterModal.css";
import { fileToDataUrl } from "../../../utils/dataURL";

function RegisterModal({
  isOpen,
  onClose,
  onOpenLogin,
  onRegister,
  authError,
}) {
  const [avatarDataUrl, setAvatarDataUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onRegister?.({
      name: name.trim(),
      email: email.trim(),
      password,
      avatarUrl: avatarDataUrl || null,
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAvatarDataUrl("");
      return;
    }

    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) return;

    const dataUrl = await fileToDataUrl(file);
    setAvatarDataUrl(dataUrl);
  };

  return (
    <ModalWithForm title="Sign Up" isOpen={isOpen} onClose={onClose}>
      <label className="auth__label">
        Name
        <input
          className="auth__input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className="auth__label">
        Email
        <input
          className="auth__input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="auth__label">
        Password
        <input
          className="auth__input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </label>

      {/* Avatar upload */}
      <label className="auth__label">
        Avatar (optional)
        <div className="auth__file">
          <input
            id="registerAvatar"
            className="auth__file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

          <label
            htmlFor="registerAvatar"
            className="auth__file-btn btn btn--outline btn--sm"
          >
            Choose File
          </label>
          {/* <span className="auth__file-name">
            {selectedFileName || "No file chosen"}
          </span> */}
        </div>
      </label>

      {avatarDataUrl && (
        <div className="auth__avatar-preview">
          <img
            className="auth__avatar-img"
            src={avatarDataUrl}
            alt="Avatar preview"
          />
        </div>
      )}

      {authError && <div className="auth__error">{authError}</div>}

      <button
        className="auth__submit btn btn--primary"
        type="button"
        onClick={handleSubmit}
        disabled={!name.trim() || !email.trim() || !password.trim()}
      >
        Create Account
      </button>

      <button
        className="auth__link btn btn--outline btn--sm"
        type="button"
        onClick={onOpenLogin}
      >
        or Sign In
      </button>
    </ModalWithForm>
  );
}

export default RegisterModal;
