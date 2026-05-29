import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import storeRoutes from "./routes/storeRoutes";
import ratingRoutes from "./routes/ratingRoutes";
import storeOwnerRoutes from "./routes/storeOwnerRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
});

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/stores", storeRoutes);
app.use("/ratings", ratingRoutes);
app.use("/store-owner", storeOwnerRoutes);
app.use("/user", userRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});