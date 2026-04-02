import express from "express";
import {
  createCompany,
  updateCompany,
  getMyCompany,
  getCompanyById,
} from "../controllers/company.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, createCompany);
router.patch("/", authenticate, updateCompany);
router.get("/me", authenticate, getMyCompany);
router.get("/:id", authenticate, getCompanyById);

export default router;
