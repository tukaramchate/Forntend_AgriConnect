import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";

/**
 * Accessible, responsive Navbar
 * Props:
 *  - cartCount (number)
 *  - wishlistCount (number)
 *  - onSearch(query: string)
 */
export default function Navbar({ cartCount = 0, wishlistCount = 0, onSearch = () => {} }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const location = useLocation();
  const menuRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // close mobile menu on route change
  useEffect(() => setOpen(false), [location.pathname]);

  // ESC to close
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // click outside to close mobile menu
  useEffect(() => {
    function onClick(e) {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  // Debounced search to avoid spamming parent
  const handleSearchChange = (value) => {
    setQ(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(value.trim()), 300);
  };

  const submit = (e) => {
    e?.preventDefault();
    clearTimeout(debounceRef.current);
    onSearch(q.trim());
  };

  // keyboard nav for mobile menu items (simple)
  const menuItems = [
    { to: "/products", label: "Products" },
    { to: "/categories", label: "Categories" },
    { to: "/orders", label: "Orders" },
    { to: "/about", label: "About" },
  ];
  const focusNext = useCallback((dir = 1) => {
    setFocusedIndex(i => {
      const next = i + dir;
      if (next < 0) return menuItems.length - 1;
      if (next >= menuItems.length) return 0;
      return next;
    });
  }, [menuItems.length]);

  useEffect(() => {
    if (focusedIndex >= 0 && menuRef.current) {
      const els = menuRef.current.querySelectorAll('.ac-navbar__menu a');
      if (els[focusedIndex]) els[focusedIndex].focus();
    }
  }, [focusedIndex]);

  return (
    <div className="ac-navbar" role="navigation" aria-label="Main">
      <div className="ac-navbar__inner ac-container" ref={menuRef}>
        <Link to="/" className="ac-logo" aria-label="AgriConnect home">
          <img src={logo} alt="" className="ac-logo__img" />
          <span className="ac-logo__text">AgriConnect</span>
        </Link>

        <form className="ac-search" role="search" onSubmit={submit} aria-label="Search products">
          <label htmlFor="ac-search-input" className="ac-visually-hidden">Search products</label>
          <input
            id="ac-search-input"
            ref={inputRef}
            className="ac-search__input"
            type="search"
            placeholder="Search products, seeds, tools..."
            value={q}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label="Search products"
          />
          <button type="submit" className="ac-search__btn" aria-label="Search">
            <svg className="ac-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </form>

        <button
          className="ac-navbar__toggle"
          aria-expanded={open}
          aria-controls="ac-navbar-menu"
          onClick={() => setOpen(s => !s)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path d={open ? "M6 18L18 6M6 6l12 12" : "M3 6h18M3 12h18M3 18h18"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </button>

        <ul id="ac-navbar-menu" className={`ac-navbar__menu ${open ? "open" : ""}`}>
          {menuItems.map((m, idx) => (
            <li key={m.to}>
              <NavLink
                to={m.to}
                className="ac-link"
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); focusNext(1); }
                  if (e.key === "ArrowUp") { e.preventDefault(); focusNext(-1); }
                }}
                onFocus={() => setFocusedIndex(idx)}
              >
                {m.label}
              </NavLink>
            </li>
          ))}

          <li>
            <Link to="/cart" className="ac-cart" aria-label={`Cart with ${cartCount} items`}>
              <svg className="ac-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M6 6h15l-1.5 9h-11z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              <span className="ac-cart__label">Cart</span>
              {cartCount > 0 && <span className="ac-cart__count" aria-hidden="false">{cartCount}</span>}
            </Link>
          </li>

          <li>
            <Link to="/wishlist" className="ac-wishlist" aria-label={`Wishlist with ${wishlistCount} items`}>
              <svg className="ac-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 22l8.8-9.6a5.5 5.5 0 0 0 0-7.8z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="ac-cart__label">Wishlist</span>
              {wishlistCount > 0 && <span className="ac-cart__count" aria-hidden="false">{wishlistCount}</span>}
            </Link>
          </li>

          <li className="ac-login-li">
            <Link to="/login" className="ac-link ac-link--cta">Login</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
