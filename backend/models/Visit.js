import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
});

const Visit = mongoose.model("Visit", visitSchema);

export default Visit;
