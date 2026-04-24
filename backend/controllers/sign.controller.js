import * as userService from "../services/sign.services.js";

export const sign_in_user = async (req, res) => {
  try {
    const { username_or_email, password } = req.body;
    const result = await userService.signIn(username_or_email, password);

    return res.status(200).json({
      message: "user logged in successfully",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "usuario no encontrado" });
    }
    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ message: "username/email or password incorrect, try again" });
    }
    console.log(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const sign_up_user = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { role } = req.query;

    await userService.signUp({ username, email, password, role });

    return res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Username or email already exists" });
    }
    if (error.message === "USER_NOT_CREATED") {
      return res.status(400).json({ message: "User not created" });
    }
    console.log(error);
    return res.status(500).json({ message: "Server error", detail: String(error) });
  }
};

export const log_out_user = (req, res) => {
  try {
    console.log(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyAccount = async (req, res) => {
  try {
    const { code, username } = req.body;
    const isVerified = await userService.verifyAccount(username, code);
    return res.json({ verificated: isVerified });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resendCode = async (req, res) => {
  try {
    const { username } = req.body;
    await userService.resendCode(username);
    return res.status(200).json({ message: "Code resent successfully" });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }
    if (error.message === "ALREADY_ACTIVE") {
      return res.status(400).json({ verify: true, message: "User is already verified" });
    }
    if (error.message === "EMAIL_FAILED") {
      return res.status(500).json({ message: "Failed to send email" });
    }
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const forgot_password = async (req, res) => {
  try {
    const { username_or_email } = req.body;
    if (!username_or_email) return res.status(400).json({ message: "Username or email is required" });

    await userService.forgotPassword(username_or_email);
    return res.status(200).json({ message: "If the user exists, an email has been sent." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const reset_password = async (req, res) => {
  try {
    const { username_or_email, verify_code, password } = req.body;
    if (!username_or_email || !verify_code || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await userService.resetPassword(username_or_email, verify_code, password);
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    if (error.message === "INVALID_CODE") {
      return res.status(400).json({ message: "Invalid or expired verify code" });
    }
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};