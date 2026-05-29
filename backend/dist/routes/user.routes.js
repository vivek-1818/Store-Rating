"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
router.put("/password", auth_middleware_1.authenticate, async (req, res) => {
    try {
        const { oldPassword, newPassword } = validation_1.passwordUpdateSchema.parse(req.body);
        if (!req.user) {
            res.status(401).json({ message: "Login required. Please log in again." });
            return;
        }
        const user = await prisma_1.default.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            res.status(401).json({ message: "User account was not found. Please log in again." });
            return;
        }
        if (!(await bcryptjs_1.default.compare(oldPassword, user.password))) {
            res.status(400).json({ message: "Old password is incorrect" });
            return;
        }
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { password: await bcryptjs_1.default.hash(newPassword, 10) }
        });
        res.json({ message: "Password updated" });
    }
    catch (error) {
        res.status(400).json((0, validation_1.validationError)(error));
    }
});
exports.default = router;
