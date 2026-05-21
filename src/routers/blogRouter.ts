import { Router } from "express"
import {
  getAllBlogs,
  getMyBlogs,
  saveBlog
} from "../controllers/blogController"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { UserRole } from "../models/userModel"
import { upload } from "../middleware/upload"

const router = Router()

router.post(
  "/create",
  authenticate,
  requireRole([UserRole.ADMIN, UserRole.MANAGER]),
  upload.single("image"), // form data key name
  saveBlog
)

// PUBLIC
router.get("/", getAllBlogs)

// PROTECTED
router.get(
  "/me",
  authenticate,
  requireRole([UserRole.ADMIN, UserRole.MANAGER]),
  getMyBlogs
)

export default router
