"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationError = exports.storeListQuerySchema = exports.userListQuerySchema = exports.passwordUpdateSchema = exports.ratingSchema = exports.createStoreSchema = exports.createUserSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(20).max(60),
    email: zod_1.z.string().email(),
    address: zod_1.z.string().max(400),
    password: zod_1.z.string().min(8).max(16).regex(/[A-Z]/).regex(/[^A-Za-z0-9]/),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(16).regex(/[A-Z]/).regex(/[^A-Za-z0-9]/),
    address: zod_1.z.string(),
    role: zod_1.z.enum(["ADMIN", "USER", "STORE_OWNER"]),
});
exports.createStoreSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    address: zod_1.z.string(),
    ownerId: zod_1.z.number(),
});
exports.ratingSchema = zod_1.z.object({
    storeId: zod_1.z.number(),
    value: zod_1.z.number().min(1).max(5),
});
exports.passwordUpdateSchema = zod_1.z.object({
    oldPassword: zod_1.z.string().min(8).max(16).regex(/[A-Z]/).regex(/[^A-Za-z0-9]/),
    newPassword: zod_1.z.string().min(8).max(16).regex(/[A-Z]/).regex(/[^A-Za-z0-9]/),
});
exports.userListQuerySchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    role: zod_1.z.string().optional(),
});
exports.storeListQuerySchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
});
// Error Handler
const validationError = (error) => {
    return {
        message: "Validation failed",
    };
};
exports.validationError = validationError;
