"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticate(req, res, next) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
        res.status(401).json({ message: "Login required" });
        return;
    }
    try {
        req.user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "dev-secret");
        next();
    }
    catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        next();
    };
}
