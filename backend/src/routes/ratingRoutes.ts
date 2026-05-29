import { Router } from "express";

import prisma from "../lib/prisma";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.post("/",authenticate,authorize("USER"),async (req, res) => {
  try {
      const storeId = Number(req.body.storeId);
      const value = Number(req.body.value);

      const store = await prisma.store.findUnique({
        where: {
          id: storeId,
        },
      });

      if (!store) {
        return res.status(404).json({
          message: "Store not found",
        });
      }

      if(!req.user){
        return res.json({
          message: "User not found"
        })
      }
      const rating = await prisma.rating.upsert({
        where: {
          userId_storeId: {
            userId: req.user.id,
            storeId,
          },
        },

        update: {
          value,
        },

        create: {
          userId: req.user.id,
          storeId,
          value,
        },
      });

      res.json({
        message: "Rating submitted successfully"
      });
    } catch (error) {
      res.status(400).json({
        message: "Failed to submit rating",
      });
    }
  }
);

export default router;
