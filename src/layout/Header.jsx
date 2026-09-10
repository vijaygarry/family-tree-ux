import React, { useEffect, useState, useRef } from "react";
import "./Header.css";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as bootstrap from "bootstrap";
import Collapse from "bootstrap/js/dist/collapse"; // ✅ Proper Bootstrap JS import

const Header = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const offcanvasRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleMobileLogout = async () => {
    handleLogout();
    closeOffcanvas();
  };

  const closeOffcanvas = () => {
    offcanvasRef.current?.hide();
  };

  const fallbackAvatar = "/default-avatar.png";

  // ✅ Header shrink on scroll
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
      className={`bg-white text-black shadow-sm sticky-sm-top header ${scrolled ? "header-scrolled" : ""}`}
    >
      {/* Visible only on desktop */}
      <nav className="navbar navbar-expand-lg navbar-dark container d-none d-md-flex">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/logo.svg"
            alt="Logo"
            height={60}
            className={`logo ${scrolled ? "logo-small" : ""}`}
          />
        </Link>
        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/family"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                My Family
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/searchfamily"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                Search Family
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/myProfile"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                My Profile
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/searchMember"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                Search Member
              </NavLink>
            </li>
            {user?.operationAllowed?.includes("ADD_FAMILY") && (
              <li className="nav-item">
                <NavLink
                  to="/addfamily"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active" : "")
                  }
                >
                  Add Family
                </NavLink>
              </li>
            )}
            {user?.operationAllowed?.includes("ADD_MEMBER_TO_ANY_FAMILY") && (
              <li className="nav-item">
                <NavLink
                  to="/addmember"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active" : "")
                  }
                >
                  Add Member
                </NavLink>
              </li>
            )}
            {/* Family Dropdown */}
            {/* <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Family
              </span>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/family">My Family</Link></li>
                <li><Link className="dropdown-item" to="/searchfamily">Search Family</Link></li>
                <li><Link className="dropdown-item" to="/addfamily">Add Family</Link></li>
              </ul>
            </li> */}
            {/* <li className="nav-item">
              <NavLink to="/events" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                Events
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/accounts" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                Accounts
              </NavLink>
            </li> */}

            {/* User Dropdown */}
            <li className="nav-item dropdown">
              <a
                href="#!"
                className="nav-link dropdown-toggle d-flex align-items-center"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="me-2">
                  {user?.firstName} {user?.lastName}
                </span>
                <img
                  src={user?.profileImageThumbnail}
                  alt="User Avatar"
                  className={`rounded-circle me-2 user-avatar ${scrolled ? "avatar-small" : ""}`}
                  width="25"
                  height="25"
                  onError={(e) => (e.currentTarget.src = fallbackAvatar)}
                />
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
              >
                <li>
                  <Link className="dropdown-item" to="/changepassword">
                    Change Password
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <NavLink
                to="/helpWithMenu"
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
              <div className="d-flex align-items-center">
                <img
                  src={user?.profileImageThumbnail || "/default-avatar.png"}
                  alt="User Avatar"
                  className="rounded-circle me-2"
                  width="40"
                  height="40"
                  onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                />
                <div className="d-flex flex-column">
                  <h5 className="offcanvas-title" id="mobileMenuLabel">
                    {user?.firstName} {user?.lastName}
                  </h5>
                </div>
              </div>
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
                    to="/"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                    onClick={() => closeOffcanvas()}
                  >
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/family"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                    onClick={() => closeOffcanvas()}
                  >
                    My Family
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/searchfamily"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                    onClick={() => closeOffcanvas()}
                  >
                    Search Family
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/myProfile"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                    onClick={() => closeOffcanvas()}
                  >
                    My Profile
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/searchMember"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                    onClick={() => closeOffcanvas()}
                  >
                    Search Member
                  </NavLink>
                </li>
                {user?.operationAllowed?.includes("ADD_FAMILY") && (
                  <li className="nav-item">
                    <NavLink
                      to="/addfamily"
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                      onClick={() => closeOffcanvas()}
                    >
                      Add Family
                    </NavLink>
                  </li>
                )}
                {user?.operationAllowed?.includes("ADD_MEMBER_TO_ANY_FAMILY") && (
                  <li className="nav-item">
                    <NavLink
                      to="/addmember"
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                      onClick={() => closeOffcanvas()}
                    >
                      Add Member
                    </NavLink>
                  </li>
                )}
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/changepassword"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                    onClick={() => closeOffcanvas()}
                  >
                    Change Password
                  </NavLink>
                </li>

                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-start"
                    onClick={handleMobileLogout}
                    style={{ textDecoration: "none" }}
                  >
                    Logout
                  </button>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/helpWithMenu"
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

export default Header;
