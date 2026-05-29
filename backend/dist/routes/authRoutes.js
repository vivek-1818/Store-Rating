"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
router.post("/signup", async (req, res) => {
    try {
        const name = String(req.body.name ?? "");
        const email = String(req.body.email ?? "").trim().toLowerCase();
        const password = String(req.body.password ?? "");
        const address = String(req.body.address ?? "");
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                address: address,
                role: "USER",
            },
        });
        res.status(201).json({
            message: "User created successfully",
            user,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Signup failed",
        });
    }
});
router.post("/login", async (req, res) => {
    try {
        const email = String(req.body.email ?? "").trim().toLowerCase();
        const password = String(req.body.password ?? "");
        const user = await prisma_1.default.user.findUnique({
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
            ? await bcryptjs_1.default.compare(password, user.password)
            : password === user.password;
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Incorrect Password",
            });
        }
        if (!isHashedPassword) {
            await prisma_1.default.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    password: await bcryptjs_1.default.hash(password, 10),
                },
            });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            role: user.role,
        }, process.env.JWT_SECRET || "secret", {
            expiresIn: "1d",
        });
        res.json({
            token,
            role: user.role,
            name: user.name,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Login failed",
        });
    }
});
exports.default = router;
