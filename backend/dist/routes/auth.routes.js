"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
router.post("/signup", async (req, res) => {
    try {
        const data = validation_1.signupSchema.parse(req.body);
        const password = await bcryptjs_1.default.hash(data.password, 10);
        const user = await prisma_1.default.user.create({
            data: { ...data, password, role: "USER" },
            select: { id: true, name: true, email: true, address: true, role: true }
        });
        res.status(201).json({ user });
    }
    catch (error) {
        res.status(400).json((0, validation_1.validationError)(error));
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = validation_1.loginSchema.parse(req.body);
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "1d" });
        res.json({ token, role: user.role, name: user.name });
    }
    catch (error) {
        res.status(400).json((0, validation_1.validationError)(error));
    }
});
exports.default = router;
