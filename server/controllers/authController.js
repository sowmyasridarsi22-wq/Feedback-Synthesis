import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const token = (u) =>
  jwt.sign(
    { id: u._id, email: u.email, role: u.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
export async function register(req, res) {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  if (await User.findOne({ email }))
    return res.status(409).json({ message: "Email already registered" });
  const u = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role,
  });
  res
    .status(201)
    .json({
      token: token(u),
      user: { name: u.name, email: u.email, role: u.role },
    });
}
export async function login(req, res) {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if (!u || !(await bcrypt.compare(password, u.password)))
    return res.status(401).json({ message: "Invalid credentials" });
  res.json({
    token: token(u),
    user: { name: u.name, email: u.email, role: u.role },
  });
}
