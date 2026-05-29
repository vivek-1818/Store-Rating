"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const storeRoutes_1 = __importDefault(require("./routes/storeRoutes"));
const ratingRoutes_1 = __importDefault(require("./routes/ratingRoutes"));
const storeOwnerRoutes_1 = __importDefault(require("./routes/storeOwnerRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({
        message: "Server is running",
    });
});
app.use("/auth", authRoutes_1.default);
app.use("/admin", adminRoutes_1.default);
app.use("/stores", storeRoutes_1.default);
app.use("/ratings", ratingRoutes_1.default);
app.use("/store-owner", storeOwnerRoutes_1.default);
app.use("/user", userRoutes_1.default);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
