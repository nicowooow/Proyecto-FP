import userRepository from "../repository/user.repository.js";
import profileRepository from "../repository/profile.repository.js";
import User from "./../models/user.model.js";
import { verify_password } from "./../middlewares/password.middleware.js";
import { createAccessToken, createRefreshToken } from "./../utils/jwt.utils.js";
import { crearClaveAuth } from "../utils/crearclave.js";
import { sendEmail } from '../utils/nodemailer.utils.js';

export const signIn = async (username_or_email, password) => {
  const user = await userRepository.checkUserSign(username_or_email);
  if (!user) throw new Error("USER_NOT_FOUND");

  const safeUser = new User(user);
  const isValid = await verify_password(password, user.password_hash);

  if (!isValid) throw new Error("INVALID_CREDENTIALS");

  const accessToken = createAccessToken(safeUser.getId(), safeUser.username, safeUser.getRole());
  const refreshToken = createRefreshToken(safeUser.getId(), safeUser.getTokenVersion());

  return {
    user: safeUser.toPublic(),
    accessToken,
    refreshToken
  };
};

export const signUp = async ({ username, email, password, role }) => {
  const verifyCode = crearClaveAuth();
  const userId = await userRepository.createUser(username, email, password, "pending", role, verifyCode);

  if (!userId) throw new Error("USER_NOT_CREATED");

  await profileRepository.createProfile(userId, username, null, "2000-01-01", email, "", null, "light");

  const emailSent = await sendEmail(email, verifyCode);
  if (!emailSent) console.log("Email failed to send properly");

  return userId;
};

export const verifyAccount = async (username, code) => {
  const user = await userRepository.getUser(username);
  if (!user || user.verify_code === null) return false;

  if (code === user.verify_code.split("-").join("")) {
    await userRepository.patchUser(user.id, null, null, null, "active", null, null);
    await userRepository.updateVerifyCode(null, user.id);
    return true;
  }
  return false;
};

export const resendCode = async (username) => {
  const user = await userRepository.getUser(username);
  if (!user) throw new Error("USER_NOT_FOUND");
  if (user.status === "active") throw new Error("ALREADY_ACTIVE");

  const newVerifyCode = crearClaveAuth();
  await userRepository.updateVerifyCode(newVerifyCode, user.id);

  setTimeout(() => {
    userRepository.updateVerifyCode(null, user.id).catch((e) => console.log(e));
  }, 5 * 60 * 1000);

  const emailSent = await sendEmail(user.email, newVerifyCode);
  if (!emailSent) throw new Error("EMAIL_FAILED");
};

export const forgotPassword = async (username_or_email) => {
  const user = await userRepository.checkUserSign(username_or_email);
  if (!user) return; // Silent return for security

  const resetCode = crearClaveAuth();
  await userRepository.updateVerifyCode(resetCode, user.id);

  setTimeout(() => {
    userRepository.updateVerifyCode(null, user.id).catch((e) => console.log(e));
  }, 10 * 60 * 1000);

  await sendEmail(user.email, resetCode);
};

export const resetPassword = async (username_or_email, verify_code, password) => {
  const user = await userRepository.checkUserSign(username_or_email);
  if (!user || user.verify_code === null) throw new Error("INVALID_CODE");

  if (verify_code === user.verify_code.split("-").join("")) {
    await userRepository.updatePassword(user.id, password);
    await userRepository.updateVerifyCode(null, user.id);
    return true;
  }
  throw new Error("INVALID_CODE");
};