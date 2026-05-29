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
router.get("/", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)("USER"), async (req, res) => {
    const search = req.query.search;
    const stores = await prisma_1.default.store.findMany({
        where: search
            ? {
                OR: [{
                        name: {
                            contains: search,
                        },
                    },
                    {
                        address: {
                            contains: search,
                        },
                    },
                ],
            }
            : {},
        include: {
            ratings: true,
        },
    });
    const result = stores.map((store) => {
        let userRating = null;
        for (let rating of store.ratings) {
            if (rating.userId === req.user?.id) {
                userRating = rating.value;
            }
        }
        return {
            id: store.id,
            name: store.name,
            address: store.address,
            overallRating: (0, avgRating_1.getAverageRating)(store.ratings),
            userRating,
        };
    });
    res.json(result);
});
exports.default = router;
