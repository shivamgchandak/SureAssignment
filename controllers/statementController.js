const Statement = require("../models/Statement");
const extractText = require("../utils/extractText");
const detectIssuer = require("../utils/detectIssuer");
const detectCurrency = require("../utils/detectCurrency");
const uploadPDF = require("../utils/uploadToCloudinary");
const formatCardIdentifier = require("../utils/formatCardIdentifier");

const parseHDFC = require("../parsers/hdfc");
const parseRBL = require("../parsers/rbl");
const parseHSBC = require("../parsers/hsbc");
const parseVISA = require("../parsers/visa");

exports.uploadStatement = async (req, res) => {
  try {
    const { pdfPassword } = req.body;

    // 1. Extract text (password-aware)
    const text = await extractText(req.file.path, pdfPassword);

    // 2. Detect metadata
    const issuer = detectIssuer(text);
    const currency = detectCurrency(text);

    // 3. Parse based on issuer
    let parsedData;

    if (issuer === "HDFC") parsedData = parseHDFC(text);
    else if (issuer === "RBL") parsedData = parseRBL(text);
    else if (issuer === "HSBC") parsedData = parseHSBC(text);
    else if (issuer === "VISA") parsedData = parseVISA(text);
    else {
      return res.status(400).json({ message: "Unsupported issuer" });
    }

    // 4. Upload PDF to Cloudinary
    const pdfUrl = await uploadPDF(req.file.path);

    // 5. Save to DB (store raw digits only)
    const statement = await Statement.create({
      user: req.user._id,
      currency,
      pdfUrl,
      ...parsedData,
    });

    // 6. Respond with formatted card identifier
    res.status(201).json({
      ...statement.toObject(),
      cardIdentifier: formatCardIdentifier(statement),
    });
  } catch (err) {
    if (err.message === "PDF_PASSWORD_REQUIRED") {
      return res.status(422).json({
        requiresPassword: true,
        message: "PDF is password protected",
      });
    }

    res.status(500).json({ message: err.message });
  }
};