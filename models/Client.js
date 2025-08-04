const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, unique: true },
    clientSecret: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    redirectUris: { type: [String], default: [] },
    scopes: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);
