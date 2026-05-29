import bcrypt from "bcryptjs";
import { Router } from "express";

import prisma from "../lib/prisma";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { getAverageRating } from "../common/avgRating";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/dashboard", async (req, res) => {
  const totalUsers = await prisma.user.count();
  const totalStores = await prisma.store.count();
  const totalRatings = await prisma.rating.count();

  res.json({
    totalUsers,
    totalStores,
    totalRatings,
  });
});

router.post("/users", async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role,
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

    const users = await prisma.user.findMany({
      where: {
        ...(name && {
          name: {
            contains: name,
            mode: "insensitive",
          },
        }),

        ...(email && {
          email: {
            contains: email,
            mode: "insensitive",
          },
        }),

        ...(address && {
          address: {
            contains: address,
            mode: "insensitive",
          },
        }),

        ...(role && {
          role: role as "ADMIN" | "USER" | "STORE_OWNER",
        }),
      },

      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
      },
    });

    users.sort((a: any, b: any) => {
      const first = String(a[sortBy] ?? "");
      const second = String(b[sortBy] ?? "");

      return order === "asc"
        ? first.localeCompare(second, undefined, {
            sensitivity: "base",
          })
        : second.localeCompare(first, undefined, {
            sensitivity: "base",
          });
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
    const { name, email, address } = req.body;
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
        name,
        email,
        address,
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

    const stores = await prisma.store.findMany({
      where: {
        ...(name && {
          name: {
            contains: name,
            mode: "insensitive",
          },
        }),

        ...(email && {
          email: {
            contains: email,
            mode: "insensitive",
          },
        }),

        ...(address && {
          address: {
            contains: address,
            mode: "insensitive",
          },
        }),
      },

      include: {
        ratings: true,
      },
    });

    const result = stores.map((store) => ({
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      rating: getAverageRating(store.ratings),
    }));

    if (sortBy === "rating") {
      result.sort((a, b) =>
        order === "desc"
          ? b.rating - a.rating
          : a.rating - b.rating
      );
    } else {
      result.sort((a: any, b: any) => {
        const first = String(a[sortBy] ?? "");
        const second = String(b[sortBy] ?? "");

        return order === "asc"
          ? first.localeCompare(second, undefined, {
              sensitivity: "base",
            })
          : second.localeCompare(first, undefined, {
              sensitivity: "base",
            });
      });
    }

    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: "Failed to get stores",
    });
  }
});

export default router;