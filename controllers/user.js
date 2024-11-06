const { z } = require("zod");
const { signUpSchema, signInSchema } = require("../lib/validation/user");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { setTokenCookie } = require("../lib/utils");

const signUp = async (req, res) => {
  try {
    const { fullName, username, email, password } = signUpSchema.parse(
      req.body
    );
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });
    const newUser = await user.save();
    if (!newUser) {
      return res.status(400).json({ message: "Failed to create user" });
    }
    setTokenCookie(res, newUser, process.env.JWT_SECRET);
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
const signIn = async (req, res) => {
  try {
    const { username, password } = signInSchema.parse(req.body);
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const passwordMatch = await bcrypt.compare(
      password,
      usernameExists.password
    );
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    setTokenCookie(res, user, process.env.JWT_SECRET);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { signUp, signIn, signOut };
