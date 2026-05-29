"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
function average(values) {
    if (values.length === 0) {
        return null;
    }
    return Number((values.reduce((sum, rating) => sum + rating.value, 0) / values.length).toFixed(2));
}
router.get("/dashboard", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("STORE_OWNER"), async (req, res) => {
    const store = await prisma_1.default.store.findUnique({
        where: { ownerId: req.user?.id },
        include: {
            ratings: {
                select: {
                    value: true,
                    user: { select: { id: true, name: true, email: true, address: true } }
                }
            }
        }
    });
    if (!store) {
        res.json({ store: null, averageRating: null, users: [] });
        return;
    }
    res.json({
        store: { id: store.id, name: store.name, email: store.email, address: store.address },
        averageRating: average(store.ratings),
        users: store.ratings.map((rating) => ({ ...rating.user, rating: rating.value }))
    });
});
exports.default = router;
