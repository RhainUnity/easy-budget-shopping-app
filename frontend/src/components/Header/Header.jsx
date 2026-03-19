// src/components/Header/Header.jsx
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Header.css";
import defaultAvatar from "../../assets/default-avatar.svg";

function Header({ isLoggedIn, email, avatarUrl, onOpenLogin, onSignOut }) {
  // Determine current page for active link styling
  const location = useLocation();
  const isCartPage = location.pathname === "/";
  const isFullListPage = location.pathname === "/full-list";

  return (
    <header className="header">
      {/* APP LOGO/NAME */}
      <Link to="/" className="header__logo">
        Easy Budget Shopping App
      </Link>

      {/* CENTER LABEL/BUTTON */}
      <div className="header__center">
        {isCartPage && (
          <span className="header__cart-label btn btn--outline btn--sm">
            My Cart
          </span>
        )}

        {isFullListPage && (
          <Link to="/" className="header__cart-button btn btn--outline">
            Back to Cart
          </Link>
        )}
      </div>

      <nav className="header__nav">
        <NavLink to="/about" className="header__link header__link--about">
          About
        </NavLink>

        {/* Avatar area */}
        {isLoggedIn ? (
          <NavLink
            to="/profile"
            className="header__avatar-link"
            aria-label="Profile"
          >
            <span className="header__email">{email}</span>
            <span className="header__avatar">
              {avatarUrl ? (
                <img
                  className="header__avatar-img"
                  src={avatarUrl}
                  alt="Profile avatar"
                />
              ) : (
                <img
                  className="header__avatar-img"
                  src={defaultAvatar}
                  alt="Default avatar"
                />
              )}
            </span>
          </NavLink>
        ) : (
          <button
            type="button"
            className="header__avatar-link header__avatar-btn"
            onClick={onOpenLogin}
            aria-label="Sign in"
            title="Sign in"
          >
            <span className="header__avatar header__avatar--empty" />
          </button>
        )}

        {/* Sign In / Out Button */}
        {isLoggedIn ? (
          <button
            className="btn btn--outline btn--sm"
            type="button"
            onClick={onSignOut}
          >
            Sign Out
          </button>
        ) : (
          <button
            className="btn btn--primary btn--sm"
            type="button"
            onClick={onOpenLogin}
          >
            Sign In
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
