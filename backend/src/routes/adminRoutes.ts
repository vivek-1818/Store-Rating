import bcrypt from "bcryptjs";
import { Router } from "express";

import prisma from "../lib/prisma";
import { authenticate, authorize } from "../middleware/authMiddleware";
import {getAverageRating} from "../common/avgRating"

const router = Router();
router.use(authenticate, authorize("ADMIN"));

router.get("/dashboard", async (req, res) => {
  const totalUsers = await prisma.user.count();
  const totalStores = await prisma.store.count();
  const totalRatings = await prisma.rating.count();

  res.json({
    totalUsers: totalUsers,
    totalStores: totalStores,
    totalRatings: totalRatings,
  });
});

router.post("/users", async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        address: address,
        role: role,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create user",
    });
  }
});

router.get("/users", async (req, res) => {
  try {
    const name = String(req.query.name ?? "");
    const email = String(req.query.email ?? "");
    const address = String(req.query.address ?? "");
    const role = String(req.query.role ?? "");
    const sortBy = String(req.query.sortBy ?? "name");
    const order = req.query.order === "desc" ? "desc" : "asc";
    const allowedSortFields = ["name", "email", "address", "role"];

    const users = await prisma.user.findMany({
      where: {
        ...(name && { name: { contains: name, mode: "insensitive" } }),
        ...(email && { email: { contains: email, mode: "insensitive" } }),
        ...(address && { address: { contains: address, mode: "insensitive" } }),
        ...(role && { role: role as "ADMIN" | "USER" | "STORE_OWNER" }),
      },
      orderBy: allowedSortFields.includes(sortBy) ? { [sortBy]: order } : { name: order },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
      },
    });

    res.json(users);
  } catch (error) {
    res.status(400).json({
      message: "Failed to get users",
    });
  }
});

router.post("/stores", async (req, res) => {
  try {
    const {name, email, address} = req.body;
    const ownerId = Number(req.body.ownerId);

    const owner = await prisma.user.findUnique({
      where: {
        id: ownerId,
      },
    });

    if (!owner || owner.role !== "STORE_OWNER") {
      return res.status(400).json({
        message: "Invalid store owner",
      });
    }

    const store = await prisma.store.create({
      data: {
        name: name,
        email: email,
        address: address,
        ownerId,
      },
    });

    res.status(201).json({
      message: "Store created successfully",
      store,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create store",
    });
  }
});

router.get("/stores", async (req, res) => {
  try {
    const name = String(req.query.name ?? "");
    const email = String(req.query.email ?? "");
    const address = String(req.query.address ?? "");
    const sortBy = String(req.query.sortBy ?? "name");
    const order = req.query.order === "desc" ? "desc" : "asc";
    const allowedSortFields = ["name", "email", "address"];

    const stores = await prisma.store.findMany({
      where: {
        ...(name && { name: { contains: name, mode: "insensitive" } }),
        ...(email && { email: { contains: email, mode: "insensitive" } }),
        ...(address && { address: { contains: address, mode: "insensitive" } }),
      },
      orderBy: allowedSortFields.includes(sortBy) ? { [sortBy]: order } : { name: order },
      include: {
        ratings: true,
      },
    });

    const result = stores.map((store) => {
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        rating: getAverageRating(store.ratings),
      };
    });

    if (sortBy === "rating") {
      result.sort((a, b) => order === "desc" ? b.rating - a.rating : a.rating - b.rating);
    }

    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: "Failed to get stores",
    });
  }
});

export default router;
