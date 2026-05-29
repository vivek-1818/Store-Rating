import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const name = String(req.body.name ?? "");
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "");
    const address = String(req.body.address ?? "");
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name:name,
        email:email,
        password: hashedPassword,
        address:address,
        role: "USER",
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: "Signup failed",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "");

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found, Insert correct email or create Account",
      });
    }

    const isHashedPassword = user.password.startsWith("$2");
    const isPasswordCorrect = isHashedPassword
      ? await bcrypt.compare(password, user.password)
      : password === user.password;

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Incorrect Password",
      });
    }

    if (!isHashedPassword) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: await bcrypt.hash(password, 10),
        },
      });
    }

    const token = jwt.sign({
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    res.status(400).json({
      message: "Login failed",
    });
  }
});

export default router;
