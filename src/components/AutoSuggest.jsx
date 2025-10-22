import { useEffect, useRef, useState } from "react";

/**
 * AutoSuggest - a small Bootstrap-styled suggestion dropdown.
 * Props:
 * - name: input name (used when calling onChange)
 * - value: current input value
 * - suggestions: array of string suggestions
 * - onChange: function called with a synthetic event { target: { name, value } }
 * - placeholder, className, ariaLabel
 */
const AutoSuggest = ({
  name,
  value = "",
  suggestions = [],
  onChange = () => {},
  placeholder = "",
  className = "",
  ariaLabel = "",
  maxSuggestions = 8,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [filtered, setFiltered] = useState([]);
  const [show, setShow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    if (!inputValue) {
      setFiltered(suggestions.slice(0, maxSuggestions));
      return;
    }
    const q = inputValue.toLowerCase();
    const f = suggestions
      .filter((s) => s.toLowerCase().includes(q))
      .slice(0, maxSuggestions);
    setFiltered(f);
  }, [inputValue, suggestions, maxSuggestions]);

  const emitChange = (val) => {
    // call parent onChange with a synthetic event shape used by AddMember
    onChange({ target: { name, value: val } });
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setShow(true);
    setActiveIndex(-1);
    emitChange(val);
  };

  const handleSelect = (val) => {
    setInputValue(val);
    setShow(false);
    setActiveIndex(-1);
    emitChange(val);
  };

  const handleKeyDown = (e) => {
    if (!show) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < filtered.length) {
        e.preventDefault();
        handleSelect(filtered[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setShow(false);
    }
  };

  // Hide suggestions when clicking outside
  useEffect(() => {
    const onDocClick = (ev) => {
      if (containerRef.current && !containerRef.current.contains(ev.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div
      ref={containerRef}
      className="position-relative"
      style={{ zIndex: 2000 }}
    >
      <input
        name={name}
        value={inputValue}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setShow(true)}
        className={`form-control mb-1 ${className}`}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete="off"
        disabled={disabled}
      />

      {show && filtered && filtered.length > 0 && (
        <ul
          className="list-group position-absolute w-100 mt-1"
          role="listbox"
          aria-label="suggestions"
          style={{ maxHeight: 240, overflowY: "auto" }}
        >
          {filtered.map((s, idx) => (
            <li
              key={s}
              role="option"
              aria-selected={idx === activeIndex}
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                idx === activeIndex ? "active" : ""
              }`}
              onMouseDown={(ev) => {
                // use mouseDown to select before blur
                ev.preventDefault();
                handleSelect(s);
              }}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoSuggest;
