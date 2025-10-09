import { useState, useEffect } from "react";

/** ✅ Success Banner */
export function SuccessBanner({ message }) {
  const [showBanner, setShowBanner] = useState(true);

  // Auto-hide after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowBanner(false), 5000);
    // Cleanup timer if component unmounts early
    return () => clearTimeout(timer);
  }, []);

  if (!showBanner) return null;

  return (
    <div
      className="alert alert-success alert-dismissible fade show d-flex justify-content-between align-items-center"
      role="alert"
    >
      <span>{message || "Operation completed successfully!"}</span>
      <button
        type="button"
        className="btn-close"
        onClick={() => setShowBanner(false)}
        aria-label="Close"
      ></button>
    </div>
  );
}

/** ❌ Failure Banner */
export function FailureBanner({ message }) {
  const [showFailureBanner, setShowFailureBanner] = useState(true);

  // Auto-hide after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowFailureBanner(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  if (!showFailureBanner) return null;

  return (
    <div
      className="alert alert-danger alert-dismissible fade show d-flex justify-content-between align-items-center"
      role="alert"
    >
      <span>{message || "Something went wrong. Please try again!"}</span>
      <button
        type="button"
        className="btn-close"
        onClick={() => setShowFailureBanner(false)}
        aria-label="Close"
      ></button>
    </div>
  );
}
