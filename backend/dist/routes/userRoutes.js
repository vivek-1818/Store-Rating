"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.put("/password", authMiddleware_1.authenticate, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!req.user) {
            return res.status(401).json({
                message: "Login required",
            });
        }
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: req.user.id,
            },
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const isPasswordCorrect = await bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Old password is incorrect",
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma_1.default.user.update({
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
    }
    catch (error) {
        res.status(400).json({
            message: "Failed to update password",
        });
    }
});
exports.default = router;
