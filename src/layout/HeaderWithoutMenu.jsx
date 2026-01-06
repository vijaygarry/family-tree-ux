import { useEffect, useRef } from "react";
import "./Header.css";
import { Link, NavLink } from "react-router-dom";
import * as bootstrap from "bootstrap";
import Collapse from "bootstrap/js/dist/collapse"; // ✅ Proper Bootstrap JS import

const HeaderWithoutMenu = () => {
  const offcanvasRef = useRef(null);

  const closeOffcanvas = () => {
    offcanvasRef.current?.hide();
  };

  useEffect(() => {
    const offcanvasEl = document.getElementById("mobileMenu");
    if (offcanvasEl) {
      offcanvasRef.current = new bootstrap.Offcanvas(offcanvasEl);
    }

    const handleHidden = () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.body.classList.remove("modal-open", "offcanvas-backdrop");
      document.querySelector(".offcanvas-backdrop")?.remove();
    };

    offcanvasEl?.addEventListener("hidden.bs.offcanvas", handleHidden);

    return () => {
      offcanvasEl?.removeEventListener("hidden.bs.offcanvas", handleHidden);
    };
  }, []);

  // ✅ Close menu when link clicked
  useEffect(() => {
    const menuToggle = document.getElementById("navbarNav");
    if (!menuToggle) return;

    // Create Bootstrap collapse instance
    const bsCollapse = new Collapse(menuToggle, { toggle: false });

    // Get all nav links and dropdown items
    const navLinks = document.querySelectorAll(
      ".navbar-nav .nav-link, .dropdown-item",
    );

    // Add click listener to close menu
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (menuToggle.classList.contains("show")) {
          bsCollapse.hide();
        }
      });
    });

    // Cleanup listeners
    return () => {
      navLinks.forEach((link) => link.removeEventListener("click", () => {}));
    };
  }, []);

  return (
    <header
      className={`bg-white text-black shadow-sm sticky-sm-top header`}
    >
      {/* Visible only on desktop */}
      <nav className="navbar navbar-expand-lg navbar-dark container d-none d-md-flex">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/logo.svg"
            alt="Logo"
            height={60}
            className="logo"
          />
        </Link>
        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                Login
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/helpWithoutMenu"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                Help
              </NavLink>
            </li>          
          </ul>
        </div>
      </nav>

      {/* Offcanvas for Mobile */}
      <nav className="navbar navbar-dark container d-flex d-md-none">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src="/logo.svg" alt="Logo" height={50} />
          </Link>

          {/* Hamburger toggle for offcanvas */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => {
              const offcanvasEl = document.getElementById("mobileMenu");
              if (!offcanvasEl) return;
              const bsOffcanvas =
                bootstrap.Offcanvas.getInstance(offcanvasEl) ||
                new bootstrap.Offcanvas(offcanvasEl);
              bsOffcanvas.toggle();
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {/* Offcanvas Menu */}
          <div
            className="offcanvas offcanvas-start text-bg-dark"
            tabIndex="-1"
            id="mobileMenu"
            aria-labelledby="mobileMenuLabel"
          >
            {/* Header with avatar + name */}
            <div className="offcanvas-header align-items-center border-bottom">
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                    onClick={() => closeOffcanvas()}
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                    onClick={() => closeOffcanvas()}
                  >
                    Sign Up
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/forgotpassword"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                    onClick={() => closeOffcanvas()}
                  >
                    Forgot Password
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/helpWithoutMenu"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                    onClick={() => closeOffcanvas()}
                  >
                    Help
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderWithoutMenu;