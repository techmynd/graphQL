const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  // every event in app will look like this and follow this Schema
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Event", eventSchema);
