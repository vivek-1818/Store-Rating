import { Router } from "express";
import prisma from "../lib/prisma";
import { authenticate, authorize } from "../middleware/authMiddleware";
import {getAverageRating} from "../common/avgRating"

const router = Router();

router.get("/",authenticate,authorize("USER"),async (req, res) => {
  const search = req.query.search as string;

    const stores = await prisma.store.findMany({
      where: search
        ? {
            OR: [{
                name: {
                  contains: search,
                },
              },

              {
                address: {
                  contains: search,
                },
              },
            ],
          }
        : {},

      include: {
        ratings: true,
      },
    });

    const result = stores.map((store) => {
      let userRating = null;

      for (let rating of store.ratings) {
        if (rating.userId === req.user?.id) {
          userRating = rating.value;
        }
      }

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating: getAverageRating(store.ratings),
        userRating,
      };
    });

    res.json(result);
  }
);

export default router;