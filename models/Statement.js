const mongoose = require("mongoose");

const statementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    issuer: String,
    currency: String,

    cardLast4: {
        type: String,
        default: null,
    },

    cardLast2: {
        type: String,
        default: null,
    },

    billingCycle: String,
    dueDate: String,

    totalAmount: Number,
    minimumAmount: Number,

    pdfUrl: String,

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Statement", statementSchema);