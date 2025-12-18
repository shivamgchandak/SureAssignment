module.exports = (text) => {
  /* ---------------- Helper ---------------- */
  const normalize = (t) => t.replace(/\s+/g, " ");

  const cleanText = normalize(text);

  const extractAmount = (label) => {
    const regex = new RegExp(
      `${label}[\\s\\S]{0,120}?([\\d,]+\\.\\d{2})`,
      "i"
    );
    const match = cleanText.match(regex);
    return match ? Number(match[1].replace(/,/g, "")) : null;
  };

  /* ---------------- Card Digits ---------------- */
  const cardLast4 =
    cleanText.match(/\b\d{4}\sX{4}\sX{4}\s(\d{4})\b/)?.[1] || null;

  const cardLast2 =
    !cardLast4
      ? cleanText.match(/\bX{6,15}(\d{2})\b/)?.[1] || null
      : null;

  /* ---------------- Billing Cycle ---------------- */
  const billingCycleMatch = cleanText.match(
    /(\d{2}-[A-Za-z]{3}-\d{2})\s+to\s+(\d{2}-[A-Za-z]{3}-\d{2})/
  );

  const billingCycle = billingCycleMatch
    ? `${billingCycleMatch[1]} - ${billingCycleMatch[2]}`
    : null;

  /* ---------------- Dates (TABLE SAFE) ---------------- */
  const allDates = cleanText.match(/\b\d{2}\/\d{2}\/\d{4}\b/g) || [];

  // VISA layout: [statementDate, paymentDueDate, ...]
  const statementDate = allDates[0] || null;
  const dueDate = allDates[1] || null;

  /* ---------------- Amounts ---------------- */
  const totalAmount =
    extractAmount("Total Payment Due") ??
    extractAmount("Total Amount Due") ??
    extractAmount("Current Balance");

  const minimumAmount =
    extractAmount("Minimum Payment Due") ??
    extractAmount("Min Due");

  return {
    issuer: "VISA",

    cardLast4,
    cardLast2,

    billingCycle,

    // ✅ correct value: 31/10/2025
    dueDate,

    // ✅ correct value: 1,211.59
    totalAmount,

    // ✅ correct value: 100.00
    minimumAmount,
  };
};