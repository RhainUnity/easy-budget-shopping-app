// src/components/Profile/Profile.jsx
import { useEffect, useState } from "react";
import "./Profile.css";
import { fileToDataUrl } from "../../utils/dataURL";
import defaultAvatar from "../../assets/default-avatar.svg";

function Profile({ isLoggedIn, user, itemCount, onUpdateAvatar }) {
  // local draft (preview) avatar
  const [previewUrl, setPreviewUrl] = useState(user?.avatarUrl || "");

  useEffect(() => {
    setPreviewUrl(user?.avatarUrl || "");
  }, [user]);

  if (!isLoggedIn) {
    return (
      <section className="profile">
        <h2>Profile</h2>
        <p>Please sign in to view your profile and saved lists.</p>
      </section>
    );
  }

  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 🔍 Debug: log file size
    console.log("Selected file size (bytes):", file.size);
    console.log(
      "Selected file size (MB):",
      (file.size / 1024 / 1024).toFixed(2),
    );

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("Image is too large. Please choose a file under 5MB.");
      return;
    }

    const dataUrl = await fileToDataUrl(file);
    setPreviewUrl(dataUrl);
  };

  const handleSave = async () => {
    try {
      await onUpdateAvatar?.({ avatarUrl: previewUrl || null });
    } catch (err) {
      console.error("Failed to save avatar:", err);
    }
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
