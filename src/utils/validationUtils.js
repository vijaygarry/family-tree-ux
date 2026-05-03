export const isValidEmail = (email) => {
  if (!email) return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Strips spaces, dashes, and parentheses used in formatted phone numbers.
const stripPhoneFormatting = (phoneNumber) =>
  phoneNumber.replace(/[\s\-(). ]/g, '');

// Accepts numbers with or without country code, and formatted variants like
// 571-484-2222, 571 484 3333, or (571) 484 5555.
// If no country code is present, +91 is assumed (see normalizePhoneNumber).
export const isValidPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return true;
  const stripped = stripPhoneFormatting(phoneNumber.trim());
  if (stripped.startsWith('+')) {
    return /^\+[1-9]\d{6,14}$/.test(stripped);
  }
  return /^\d{7,15}$/.test(stripped);
};

