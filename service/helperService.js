const jwt = require("jsonwebtoken");
const AuthError = require("../error/authError");
const User = require("../model/userSchema");

const validUserByEmail = async function (email) {
  let result = await User.findOne({ email: email });
  if (!result) throw new AuthError("invalid email", 401);
  return result;
};

const validUserbyPhone = async function (phone) {
  let result = await User.findOne({ phone: phone });
  if (!result) throw new AuthError("invalid phone", 401);
  return result;
};

const generateToken = async function (id, email1) {
  try {
    const secretkety = process.env.TOKEN_SECRET_KEY;
    const token = await jwt.sign({ id, email1 }, secretkety);
    let updatedOtp = await User.updateOne(
      { email: email1 },
      { $set: { token: token } }
    );
    return token;
  } catch (err) {
    throw new AuthError(err.message, 401);
  }
};

module.exports = { generateToken, validUserByEmail, validUserbyPhone };
