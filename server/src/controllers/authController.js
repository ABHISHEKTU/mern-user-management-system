import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

// Compared when email not found, so response time stays similar
const DUMMY_HASH = bcrypt.hashSync("dummy-password-123", 12);

const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: "User already exists" });
  }

  try {
    const user = await User.create({ name, email, password });
    return res
      .status(201)
      .json({ token: generateToken(user._id), user: userResponse(user) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "User already exists" });
    }
    throw err;
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    await bcrypt.compare(password, DUMMY_HASH);
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const match = await user.comparePassword(password);
  if (!match) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({ token: generateToken(user._id), user: userResponse(user) });
};