// backend/utils/database.js
const mongoose = require("mongoose");

let cached = global._mongooseCached;
if (!cached) cached = global._mongooseCached = { conn: null, promise: null };

async function connectDatabase() {
  try {
    const uri = process.env.MONGO_URI;

    console.log("✅ MONGO_URI exists?", !!uri); // debug
    if (!uri) {
      throw new Error("❌ MONGO_URI is missing in environment variables");
    }

    // ✅ éviter de reconnecter à chaque fois
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
      cached.promise = mongoose.connect(uri, {
        // options ok pour mongoose 6+
      });
    }

    cached.conn = await cached.promise;
    console.log("✅ MongoDB connected");
    return cached.conn;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
}

module.exports = connectDatabase;