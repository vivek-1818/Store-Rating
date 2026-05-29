import bcrypt from "bcryptjs";
import { Router } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.put("/password", authenticate, async (req, res) => {
  try {
    const {oldPassword, newPassword} = req.body;

    if (!req.user) {
      return res.status(401).json({
        message: "Login required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.json({
      message: "Password updated successfully",
    });

  } catch (error) {
    res.status(400).json({
      message: "Failed to update password",
    });
  }
});

export default router;