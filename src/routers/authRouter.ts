import { Router } from "express"
import { createUser, getMyDetails, login } from "../controllers/authController"
import { authenticate } from "../middleware/auth"

const router = Router()

// PUBLIC
router.post("/register", createUser)
router.post("/login", login)

// PROTECTED
router.get("/me", authenticate, getMyDetails)

export default router
