import { Router } from "express";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema } from "../validators/userValidator.js";
import {
  getProfile,
  updateProfile,
  getUsers,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();

router.use(authMiddleware);

router
  .route("/profile")
  .get(getProfile)
  .put(validate(updateProfileSchema), updateProfile);

router.get("/", adminOnly, getUsers);
router.delete("/:id", deleteUser);

export default router;