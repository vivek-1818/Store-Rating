"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)("USER"), async (req, res) => {
    try {
        const storeId = Number(req.body.storeId);
        const value = Number(req.body.value);
        const store = await prisma_1.default.store.findUnique({
            where: {
                id: storeId,
            },
        });
        if (!store) {
            return res.status(404).json({
                message: "Store not found",
            });
        }
        if (!req.user) {
            return res.json({
                message: "User not found"
            });
        }
        const rating = await prisma_1.default.rating.upsert({
            where: {
                userId_storeId: {
                    userId: req.user.id,
                    storeId,
                },
            },
            update: {
                value,
            },
            create: {
                userId: req.user.id,
                storeId,
                value,
            },
        });
        res.json({
            message: "Rating submitted successfully"
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Failed to submit rating",
        });
    }
});
exports.default = router;
