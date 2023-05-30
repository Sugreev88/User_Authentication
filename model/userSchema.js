const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 50,
      validate: {
        validator: function (value) {
          // Regex pattern to match alphabets and numbers 1-9
          const regex = /^[A-Za-z\s]+$/;
          return regex.test(value);
        },
        message: "Name must contain only alphabets and numbers 1-9.",
      },
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      maxlength: 200,
      required: true,
      validate: {
        validator: function (value) {
          // Regex pattern to match email format
          const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return regex.test(value);
        },
        message: "Email address is not valid.",
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "Solver"],
    },
    phone: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: function (value) {
          // Regex pattern to match 10-digit phone number
          const regex = /^\d{10}$/;
          return regex.test(value);
        },
        message: "Phone number must be a 10-digit number.",
      },
    },
    token: {
      type: String,
    },
    otp: {
      type: String,
      index: { expires: 300 },
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", UserSchema);
