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
router.get("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("USER"), async (req, res) => {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const stores = await prisma_1.default.store.findMany({
        where: search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { address: { contains: search, mode: "insensitive" } }
                ]
            }
            : undefined,
        include: { ratings: { select: { userId: true, value: true } } },
        orderBy: { name: "asc" }
    });
    res.json({
        stores: stores.map((store) => ({
            id: store.id,
            name: store.name,
            address: store.address,
            overallRating: average(store.ratings),
            userRating: store.ratings.find((rating) => rating.userId === req.user?.id)?.value ?? null
        }))
    });
});
exports.default = router;
