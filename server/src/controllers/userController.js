import mongoose from "mongoose";
import User from "../models/User.js";

const toDTO = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

export const getProfile = async (req, res) => {
  res.json({ user: toDTO(req.user) });
};

export const updateProfile = async (req, res) => {
  const { name, email } = req.body;

  if (email && email !== req.user.email) {
    const taken = await User.findOne({ email });
    if (taken) {
      return res.status(409).json({ message: "Email already in use" });
    }
    req.user.email = email;
  }
  if (name) req.user.name = name;

  try {
    await req.user.save();
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already in use" });
    }
    throw err;
  }

  res.json({ user: toDTO(req.user) });
};

export const getUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ users: users.map(toDTO) });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const isSelf = req.user._id.toString() === id;
  if (!isSelf && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not allowed to delete this user" });
  }

  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "User deleted" });
};