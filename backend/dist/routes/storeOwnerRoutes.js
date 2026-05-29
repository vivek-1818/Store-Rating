"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const avgRating_1 = require("../common/avgRating");
const router = (0, express_1.Router)();
router.get("/dashboard", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)("STORE_OWNER"), async (req, res) => {
    const store = await prisma_1.default.store.findUnique({
        where: {
            ownerId: req.user?.id,
        },
        include: {
            ratings: {
                include: {
                    user: true,
                },
            },
        },
    });
    if (!store) {
        return res.json({
            store: null,
            averageRating: null,
            users: [],
        });
    }
    const users = store.ratings.map((rating) => {
        return {
            id: rating.user.id,
            name: rating.user.name,
            email: rating.user.email,
            address: rating.user.address,
            rating: rating.value,
        };
    });
    res.json({
        store: {
            id: store.id,
            name: store.name,
            email: store.email,
            address: store.address,
        },
        averageRating: (0, avgRating_1.getAverageRating)(store.ratings),
        users,
    });
});
exports.default = router;
