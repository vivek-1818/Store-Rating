import { Router } from "express";
import prisma from "../lib/prisma";
import { authenticate, authorize } from "../middleware/authMiddleware";
import {getAverageRating} from "../common/avgRating"

const router = Router();

router.get("/dashboard",authenticate,authorize("STORE_OWNER"),async (req, res) => {
    const store = await prisma.store.findUnique({
      where: {
        ownerId: req.user?.id,
      },
      include: {
        ratings: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!store) {
      return res.json({
        store: null,
        averageRating: null,
        users: [],
      });
    }

    const users = store.ratings.map((rating) => {
      return {
        id: rating.user.id,
        name: rating.user.name,
        email: rating.user.email,
        address: rating.user.address,
        rating: rating.value,
      };
    });

    res.json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
      },

      averageRating: getAverageRating(store.ratings),
      users,
    });
  }
);

export default router;
