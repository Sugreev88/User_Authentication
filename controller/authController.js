const { default: mongoose } = require("mongoose");
const authService = require("../service/authService");
const ValidationError = require("../error/validationError");
const AuthError = require("../error/authError");
const helperService = require("../service/helperService");

const errorHandler = async function (error, next) {
  if (error instanceof mongoose.Error.ValidationError) {
    next(new ValidationError(error.message));
  } else if (error.code == 11000) {
    next(new ValidationError(error.message));
  }
  next(error);
};

const createUser = async function (req, res, next) {
  try {
    const { name, email, phone, role, password } = req.body;
    let id = await authService.addUserToDb({
      name,
      email,
      phone,
      role,
      password,
    });
    res.status(201).send({
      message: `id:${id}  please verify your mobile or email`,
    });
  } catch (error) {
    errorHandler(error, next);
  }
};

const verifyMobile = async function (req, res, next) {
  try {
    const { phone } = req.body;
    await authService.generateOtpOnMobile(phone);
    res.status(200).send({ message: "succesfully send otp on mobile" });
    // res.status(200).send((SUCCESS_CODE = 2001));
  } catch (error) {
    errorHandler(error, next);
  }
};

const verifyOtp = async function (req, res, next) {
  try {
    const { phone, otp } = req.body;
    await authService.verifyOtpViaMobile(phone, otp);
    await authService.updateOtpToDb(phone, otp);
    res.status(200).send({
      message:
        "succesfully verified Please Login Via Email or Phone and Password",
    });
  } catch (error) {
    errorHandler(error, next);
  }
};

const userLogin = async function (req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    const token = await helperService.generateToken(user.id, user.email);
    res.status(200).send({ message: `succesfully logged in , ${token}` });
  } catch (error) {
    errorHandler(error, next);
  }
};

const verifyEmail = async function (req, res, next) {
  try {
    const { email } = req.body;
    await authService.generateOtpViaMail(email);
    res.status(200).send({ message: "succesfully send otp on mail" });
    // res.status(200).send("SUCCESS_CODE = 2002");
  } catch (error) {
    errorHandler(error, next);
  }
};

const verifyEmailOtp = async function (req, res, next) {
  try {
    const { email, otp } = req.body;
    let user = await helperService.validUserByEmail(email);
    if (user.isActive) {
      return res
        .status(200)
        .send({ message: "please login via Email or Phone and Password" });
    }
    await authService.verifyOtpViaEmail(email, otp);
    return res.status(200).send({
      message:
        "succesfully verified Please Login Via Email or Phone and Password",
    });
  } catch (error) {
    errorHandler(error, next);
  }
};

const loginViaToken = async function (req, res, next) {
  try {
    const token =
      req.headers.authorization.split(" ")[1] ||
      req.headers.authorization.split(" ")[0];
    console.log(token);
    if (!token) throw new AuthError("Please send token", 401);
    await authService.verifyToken(token);
    res.status(200).send({ message: "Successfully Logged In" });
  } catch (error) {
    errorHandler(error, next);
  }
};

const logout = async function (req, res, next) {
  try {
    const user = req.loggedInUser;
    // console.log(token);
    const Token = user.token;
    await authService.logoutViaToken(Token);
    res.status(200).send({ message: "Successfully logged Out" });
  } catch (error) {
    errorHandler(error, next);
  }
};

const verifyLogintoken = async function (req, res, next) {
  try {
    const token =
      req.headers.authorization.split(" ")[1] ||
      req.headers.authorization.split(" ")[0];
    // console.log(token);
    if (!token) throw new AuthError("please send token", 401);
    let user = await authService.verifyToken(token);
    req.loggedInUser = user;
    next();
  } catch (error) {
    errorHandler(error, next);
  }
};

module.exports = {
  createUser,
  verifyMobile,
  errorHandler,
  verifyOtp,
  userLogin,
  verifyEmail,
  verifyEmailOtp,
  loginViaToken,
  verifyLogintoken,
  logout,
};
