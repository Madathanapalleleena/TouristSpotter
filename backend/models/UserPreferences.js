const mongoose = require("mongoose");

const UserPreferencesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  interests: [{ type: String, required: true }],
  duration: { type: Number, required: true },
  startDate: { type: Date, required: true },
  location: { type: String, required: true },
  selectedPlaces: [
    {
      name: { type: String, required: false }, // ✅ Changed required: true → false
      lat: { type: Number, required: false },
      lon: { type: Number, required: false },
    }
  ],
}, { timestamps: true });


// ✅ Add method to format selected places for AI
UserPreferencesSchema.methods.getFormattedPreferences = function () {
  return {
    interests: this.interests.join(", "), // Convert array to string
    duration: this.duration,
    location: this.location,
    selectedPlaces: this.selectedPlaces.map(place => place.name).join(", ") // Extract names only
  };
};

const UserPreferences = mongoose.model("UserPreferences", UserPreferencesSchema);
module.exports = UserPreferences;
