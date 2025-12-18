module.exports = (text) => {

  const extractAmountLoose = (labels) => {
    for (const label of labels) {
      const regex = new RegExp(
        `${label}[\\s\\S]{0,120}?(?:AED\\s*)?([\\d,]+\\.\\d{2})`,
        "i"
      );
      const match = text.match(regex);
      if (match) {
        const num = Number(match[1].replace(/,/g, ""));
        if (!Number.isNaN(num)) return num;
      }
    }
    return null;
  };

  const extractDueDate = () => {
    const match = text.match(
      /(Due Date|Payment Due Date)[\s\S]{0,40}?(\d{1,2}\s+\w+\s+\d{4})/i
    );
    return match ? match[2] : null;
  };

  // Card digits
  const last4Match = text.match(/\b\d{4}-\d{4}-\d{4}-(\d{4})\b/);
  const cardLast4 = last4Match ? last4Match[1] : null;

  let cardLast2 = null;
  if (!cardLast4) {
    const last2Match = text.match(/\bX{6,15}(\d{2})\b/);
    cardLast2 = last2Match ? last2Match[1] : null;
  }

  return {
    issuer: "HSBC",

    cardLast4,
    cardLast2,

    billingCycle:
      text.match(
        /Statement Period:\s*From\s*(\d{2}\s+\w+\s+\d{2})\s*to\s*(\d{2}\s+\w+\s+\d{2})/i
      )
        ? `${RegExp.$1} - ${RegExp.$2}`
        : null,

    dueDate: extractDueDate(),

    totalAmount: extractAmountLoose([
      "Total Amount payable for this statement",
      "Total Payment Due",
      "Total Amount Due",
      "Total Outstanding"
    ]),

    minimumAmount: extractAmountLoose([
      "Minimum Payment Due",
      "Minimum Amount Due",
      "Minimum Due"
    ]),
  };
};