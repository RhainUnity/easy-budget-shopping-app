// src/components/Profile/Profile.jsx
import { useState } from "react";
import "./Profile.css";
import { fileToDataUrl } from "../../utils/dataURL";
import defaultAvatar from "../../assets/default-avatar.svg";

function Profile({ isLoggedIn, user, itemCount, onUpdateAvatar }) {
  // local draft (preview) avatar
  const [previewUrl, setPreviewUrl] = useState(user?.avatarUrl || "");

  if (!isLoggedIn) {
    return (
      <section className="profile">
        <h2>Profile</h2>
        <p>Please sign in to view your profile and saved lists.</p>
      </section>
    );
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) return;

    const dataUrl = await fileToDataUrl(file);
    setPreviewUrl(dataUrl);
  };

  const handleSave = () => {
    onUpdateAvatar?.({ avatarUrl: previewUrl || null });
  };

  const handleReset = () => {
    setPreviewUrl(user?.avatarUrl || "");
  };

  return (
    <section className="profile">
      <h2>Profile</h2>

      <div className="profile__card">
        <img
          className="profile__avatar"
          src={previewUrl || defaultAvatar}
          alt="Avatar"
        />

        <div className="profile__info">
          <p>
            <strong>Email:</strong> {user?.email || "Unknown"}
          </p>
          <p>
            <strong>Saved items:</strong> {itemCount}
          </p>
        </div>
      </div>

      <div className="profile__editor">
        <label className="profile__label">
          Upload Avatar
          <div className="profile__file">
            {" "}
            <input
              id="profileAvatar"
              className="profile__file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <label
              htmlFor="profileAvatar"
              className="profile__file-btn btn btn--outline btn--sm"
            >
              Choose File
            </label>
          </div>
        </label>

        <div className="profile__actions">
          <button
            className="profile__btn btn btn--primary btn--sm"
            type="button"
            onClick={handleSave}
          >
            Save Avatar
          </button>

          <button
            className="profile__btn btn btn--outline btn--sm"
            type="button"
            onClick={handleReset}
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
}

export default Profile;
