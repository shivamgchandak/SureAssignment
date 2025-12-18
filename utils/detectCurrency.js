const detectCurrency = (text) => {
  if (
    text.includes("₹") ||
    text.includes("INR") ||
    text.includes("Rs.")
  ) 
    return "INR";
  if (
    text.includes("AED") ||
    text.includes("Dirham") ||
    text.includes("د.إ")
  )
    return "AED";
  if (text.includes("$")) return "USD";

  return "UNKNOWN"; // LLM fallback later
};

module.exports = detectCurrency;