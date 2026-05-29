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
router.use(auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN"));
function average(values) {
    if (values.length === 0) {
        return null;
    }
    return Number((values.reduce((sum, rating) => sum + rating.value, 0) / values.length).toFixed(2));
}
router.get("/dashboard", async (_req, res) => {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
        prisma_1.default.user.count(),
        prisma_1.default.store.count(),
        prisma_1.default.rating.count()
    ]);
    res.json({ totalUsers, totalStores, totalRatings });
});
router.post("/users", async (req, res) => {
    try {
        const data = validation_1.createUserSchema.parse(req.body);
        const password = await bcryptjs_1.default.hash(data.password, 10);
        const user = await prisma_1.default.user.create({
            data: { ...data, password },
            select: { id: true, name: true, email: true, address: true, role: true }
        });
        res.status(201).json({ user });
    }
    catch (error) {
        res.status(400).json((0, validation_1.validationError)(error));
    }
});
router.get("/users", async (req, res) => {
    try {
        const query = validation_1.userListQuerySchema.parse(req.query);
        const users = await prisma_1.default.user.findMany({
            where: {
                name: query.name ? { contains: query.name, mode: "insensitive" } : undefined,
                email: query.email ? { contains: query.email, mode: "insensitive" } : undefined,
                address: query.address ? { contains: query.address, mode: "insensitive" } : undefined,
                role: query.role
            },
            orderBy: { [query.sortBy]: query.order },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
                store: { select: { ratings: { select: { value: true } } } }
            }
        });
        res.json({
            users: users.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role,
                rating: user.store ? average(user.store.ratings) : null
            }))
        });
    }
    catch (error) {
        res.status(400).json((0, validation_1.validationError)(error));
    }
});
router.post("/stores", async (req, res) => {
    try {
        const data = validation_1.createStoreSchema.parse(req.body);
        const owner = await prisma_1.default.user.findFirst({
            where: { id: data.ownerId, role: "STORE_OWNER" }
        });
        if (!owner) {
            res.status(400).json({ message: "Owner must be an existing STORE_OWNER user" });
            return;
        }
        const store = await prisma_1.default.store.create({
            data,
            select: { id: true, name: true, email: true, address: true, ownerId: true }
        });
        res.status(201).json({ store });
    }
    catch (error) {
        res.status(400).json((0, validation_1.validationError)(error));
    }
});
router.get("/stores", async (req, res) => {
    try {
        const query = validation_1.storeListQuerySchema.parse(req.query);
        const stores = await prisma_1.default.store.findMany({
            where: {
                name: query.name ? { contains: query.name, mode: "insensitive" } : undefined,
                email: query.email ? { contains: query.email, mode: "insensitive" } : undefined,
                address: query.address ? { contains: query.address, mode: "insensitive" } : undefined
            },
            orderBy: query.sortBy === "rating" ? undefined : { [query.sortBy]: query.order },
            include: { ratings: { select: { value: true } } }
        });
        const result = stores.map((store) => ({
            id: store.id,
            name: store.name,
            email: store.email,
            address: store.address,
            rating: average(store.ratings)
        }));
        if (query.sortBy === "rating") {
            result.sort((a, b) => {
                const left = a.rating ?? 0;
                const right = b.rating ?? 0;
                return query.order === "asc" ? left - right : right - left;
            });
        }
        res.json({ stores: result });
    }
    catch (error) {
        res.status(400).json((0, validation_1.validationError)(error));
    }
});
exports.default = router;
