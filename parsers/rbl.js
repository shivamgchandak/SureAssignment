module.exports = (text) => {
  const extractAmount = (label) => {
    const match = text.match(
      new RegExp(`${label}[\\s\\S]{0,40}?([\\d,]+\\.\\d{2})`, "i")
    );
    if (!match) return null;
    const num = Number(match[1].replace(/,/g, ""));
    return Number.isNaN(num) ? null : num;
  };

  const last2Match =
    text.match(/Card Number\s+X{6,}(\d{2})/i) ||
    text.match(/XXXXXXXXXXXX(\d{2})/i);

  return {
    issuer: "RBL",

    cardLast4: null,
    cardLast2: last2Match?.[1] || null,

    billingCycle:
      text.match(/Statement Period\s*:?(.+?\d{4})/i)?.[1]?.trim() || null,

    dueDate:
      text.match(/Payment Due Date\s*:?(\d{2}\s\w+\s\d{4})/i)?.[1] || null,

    totalAmount: extractAmount("Total Amount Due"),
    minimumAmount: extractAmount("Min\\. Amt\\. Due"),
  };
};