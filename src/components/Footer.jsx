import React, { useState } from "react";
import "./Footer.css";
import logo from "../assets/logo.png";

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  function isValidEmail(v) {
    return /^\S+@\S+\.\S+$/.test(v);
  }

  function handleSubscribe(e) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus({ type: "error", text: "Please enter a valid email address." });
      return;
    }
    // Simulate subscription (UI-only)
    setStatus({ type: "success", text: "Subscribed — check your inbox." });
    setEmail("");
    setTimeout(() => setStatus(null), 4000);
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer
      className="ac-site-footer"
      role="contentinfo"
      aria-labelledby="ac-footer-title"
    >
      <div className="ac-site-footer__inner container">
        <div className="ac-site-footer__col ac-site-footer__brand-col">
          <div className="ac-site-footer__brand" id="ac-footer-title">
            {logo ? (
              <img src={logo} alt="AgriConnect" />
            ) : (
              <div className="ac-logo-placeholder">AgriConnect</div>
            )}
            <div>
              <div className="ac-logo__text">AgriConnect</div>
              <div className="ac-site-footer__tag">
                Connecting farmers to markets
              </div>
            </div>
          </div>

          <div
            className="ac-site-footer__social"
            aria-label="AgriConnect social links"
          >
            <a href="#" aria-label="Facebook" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5.02 3.66 9.18 8.44 9.92v-7.03H8.1v-2.89h2.34V9.41c0-2.32 1.38-3.6 3.5-3.6.99 0 2.03.18 2.03.18v2.23h-1.14c-1.13 0-1.48.7-1.48 1.42v1.71h2.52l-.4 2.89h-2.12v7.03C18.34 21.25 22 17.09 22 12.07z" />
              </svg>
            </a>
            <a href="#" aria-label="Twitter" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 5.92c-.63.28-1.3.46-2 .54a3.48 3.48 0 0 0 1.53-1.92 6.9 6.9 0 0 1-2.2.85 3.44 3.44 0 0 0-5.86 3.13A9.76 9.76 0 0 1 3.1 4.7a3.44 3.44 0 0 0 1.06 4.6 3.4 3.4 0 0 1-1.56-.43v.04a3.44 3.44 0 0 0 2.76 3.37 3.5 3.5 0 0 1-.9.12c-.22 0-.44-.02-.65-.06a3.44 3.44 0 0 0 3.21 2.39 6.9 6.9 0 0 1-4.28 1.48c-.28 0-.56-.02-.83-.05A9.73 9.73 0 0 0 8.77 20c6.18 0 9.56-5.12 9.56-9.56v-.44A6.83 6.83 0 0 0 22 5.92z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.5A4.5 4.5 0 1 0 16.5 13 4.5 4.5 0 0 0 12 8.5zm6.5-2.4a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1zM12 10.5A1.5 1.5 0 1 1 10.5 12 1.5 1.5 0 0 1 12 10.5z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="ac-site-footer__col">
          <h4 className="ac-site-footer__heading">Quick links</h4>
          <nav className="ac-site-footer__links" aria-label="Quick links">
            <a href="/products">Products</a>
            <a href="/categories">Categories</a>
            <a href="/orders">My Orders</a>
            <a href="/cart">Cart</a>
          </nav>
        </div>

        <div className="ac-site-footer__col">
          <h4 className="ac-site-footer__heading">Support</h4>
          <ul className="ac-site-footer__links-list" aria-label="Support links">
            <li><a href="/help">Help center</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/contact">Contact us</a></li>
            <li><a href="/shipping">Shipping</a></li>
          </ul>
        </div>

        <div className="ac-site-footer__col">
          <h4 className="ac-site-footer__heading">Get updates</h4>
          <p className="ac-site-footer__small">Subscribe for product updates and offers.</p>
          <form
            className="ac-site-footer__subscribe"
            onSubmit={handleSubscribe}
            aria-live="polite"
          >
            <label htmlFor="ac-news-email" className="sr-only">
              Email
            </label>
            <div className="ac-site-footer__subscribe-row">
              <input
                id="ac-news-email"
                className="ac-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <button className="btn btn--primary" type="submit">
                Subscribe
              </button>
            </div>
            {status && (
              <div
                className={`ac-site-footer__msg ${status.type === "error" ? "error" : "success"}`}
                role="status"
                aria-live="polite"
              >
                {status.text}
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="ac-site-footer__bottom container" role="region" aria-label="Footer bottom">
        <div className="ac-site-footer__copyright">© {year} AgriConnect • Built by Tukaram Chate</div>

        <div className="ac-site-footer__bottom-actions">
          <div className="ac-legal-links">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/sitemap">Sitemap</a>
          </div>
          <button
            className="ac-back-to-top"
            onClick={scrollTop}
            aria-label="Back to top"
          >
            Top
          </button>
        </div>
      </div>
    </footer>
  );
}