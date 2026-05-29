"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("USER"), async (req, res) => {
    try {
        const data = validation_1.ratingSchema.parse(req.body);
        const store = await prisma_1.default.store.findUnique({ where: { id: data.storeId } });
        if (!store || !req.user) {
            res.status(404).json({ message: "Store not found" });
            return;
        }
        const rating = await prisma_1.default.rating.upsert({
            where: { userId_storeId: { userId: req.user.id, storeId: data.storeId } },
            update: { value: data.value },
            create: { userId: req.user.id, storeId: data.storeId, value: data.value },
            select: { id: true, storeId: true, value: true }
        });
        res.json({ rating });
    }
    catch (error) {
        res.status(400).json((0, validation_1.validationError)(error));
    }
});
exports.default = router;
