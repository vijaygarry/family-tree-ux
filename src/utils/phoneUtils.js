export const getCountryFlag = (phoneNumber) => {
  if (!phoneNumber) return "";
  if (phoneNumber.startsWith("+91")) return "🇮🇳";
  if (phoneNumber.startsWith("+1")) return "🇺🇸";
  if (phoneNumber.startsWith("+353")) return "🇮🇪";
  return "🌐";
};

export const getFormattedPhoneDisplay = (phoneNumber) => {
  if (!phoneNumber) return "";
  const flag = getCountryFlag(phoneNumber);
  return `${flag} ${phoneNumber}`;
};
