// src/components/App/App.jsx
import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import { signup, signin, checkToken } from "../../utils/auth";
import {
  getItems,
  createItem,
  deleteItem,
  updateItem,
  updateCurrentUser,
} from "../../utils/api";

import Header from "../Header/Header";
import Main from "../Main/Main";
import Profile from "../Profile/Profile";
import Footer from "../Footer/Footer";
import FullList from "../FullList/FullList";
import About from "../About/About";

import LoginModal from "../Modals/LoginModal/LoginModal";
import RegisterModal from "../Modals/RegisterModal/RegisterModal";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState("");
  const [items, setItems] = useState([]);
  const [itemsError, setItemsError] = useState("");
  const [isItemsLoading, setIsItemsLoading] = useState(false);

  const STORE_TABS = ["WinCo", "Safeway", "Albertson's"];
  const [activeStore, setActiveStore] = useState("Safeway");

  const isLoggedIn = Boolean(currentUser);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const storeItems = useMemo(
    () => items.filter((item) => (item.store ?? "Safeway") === activeStore),
    [items, activeStore],
  );

  const finalizeAuth = (authData) => {
    localStorage.setItem("jwt", authData.token);

    return checkToken(authData.token).then((userData) => {
      setCurrentUser(userData);
      closeAllModals();
      return loadItems();
    });
  };

  const loadItems = () => {
    const token = localStorage.getItem("jwt");
    if (!token) return Promise.resolve();

    setIsItemsLoading(true);
    setItemsError("");

    return getItems()
      .then((itemsData) => {
        setItems(itemsData);
      })
      .catch((err) => {
        setItemsError(err.message || "Failed to load items");
      })
      .finally(() => {
        setIsItemsLoading(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    checkToken(token)
      .then((userData) => {
        setCurrentUser(userData);
        return getItems();
      })
      .then((itemsData) => {
        setItems(itemsData);
      })
      .catch(() => {
        localStorage.removeItem("jwt");
        setCurrentUser(null);
        setItems([]);
      });
  }, []);

  const handleSignIn = ({ email, password }) => {
    setAuthError("");

    return signin({ email, password })
      .then(finalizeAuth)
      .catch((err) => {
        setAuthError(err.message || "Sign in failed");
      });
  };

  const handleRegister = ({ name, email, password }) => {
    setAuthError("");

    return signup({ name, email, password })
      .then(() => signin({ email, password }))
      .then(finalizeAuth)
      .catch((err) => {
        setAuthError(err.message || "Registration failed");
      });
  };

  const handleAddItem = (newItem) =>
    createItem({
      ...newItem,
      store: activeStore,
    }).then((createdItem) => {
      setItems((prev) => [createdItem, ...prev]);
    });

  const handleUpdateItem = (itemId, patch) => {
    // optimistic update -- immediately reflect change in UI, then confirm with server
    // if server update fails, revert to latest from server
    setItems((prev) =>
      prev.map((item) => (item._id === itemId ? { ...item, ...patch } : item)),
    );

    return updateItem(itemId, patch).catch((err) => {
      console.error("Failed to update item:", err);
      loadItems(); // fallback reload
      throw err;
    });
  };

  const handleDeleteItem = (itemId) =>
    deleteItem(itemId).then(() => {
      setItems((prev) => prev.filter((item) => item._id !== itemId));
    });

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setActiveStore("Safeway");
    setItems([]);
  };

  const closeAllModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setAuthError("");
  };

  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
    setAuthError("");
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
    setAuthError("");
  };

  const handleUpdateAvatar = (avatarPatch) =>
    updateCurrentUser(avatarPatch).then((updatedUser) => {
      setCurrentUser(updatedUser);
    });

  return (
    <div className="page">
      <Header
        isLoggedIn={isLoggedIn}
        email={currentUser?.email || ""}
        avatarUrl={currentUser?.avatarUrl || null}
        onOpenLogin={openLogin}
        onSignOut={handleSignOut}
      />

      <main className="page__content">
        {itemsError && <p className="page__error">{itemsError}</p>}
        {isItemsLoading && <p className="page__loading">Loading items...</p>}

        <Routes>
          <Route path="/about" element={<About />} />

          <Route
            path="/profile"
            element={
              <Profile
                isLoggedIn={isLoggedIn}
                user={currentUser}
                itemCount={items.length}
                onUpdateAvatar={handleUpdateAvatar}
              />
            }
          />

          <Route
            path="/"
            element={
              <Main
                items={storeItems}
                activeStore={activeStore}
                setActiveStore={setActiveStore}
                stores={STORE_TABS}
                onUpdateItem={handleUpdateItem}
              />
            }
          />

          <Route
            path="/full-list"
            element={
              <FullList
                items={storeItems}
                activeStore={activeStore}
                setActiveStore={setActiveStore}
                stores={STORE_TABS}
                onAddItem={handleAddItem}
                onDeleteItem={handleDeleteItem}
                onUpdateItem={handleUpdateItem}
              />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeAllModals}
        onLogin={handleSignIn}
        onOpenRegister={openRegister}
        authError={authError}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={closeAllModals}
        onOpenLogin={openLogin}
        onRegister={handleRegister}
        authError={authError}
      />
    </div>
  );
}

export default App;
