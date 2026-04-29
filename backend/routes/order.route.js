import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { 
    createOrder, 
    getUserOrders, 
    getAllOrders, 
    updateOrderStatus 
} from "../controllers/order.controller.js";

const router = express.Router();

// Customer Routes
router.post("/", protectRoute, createOrder); // THE NEW DIRECT CHECKOUT ROUTE
router.get("/", protectRoute, getUserOrders);

// Admin Routes
router.get("/all", protectRoute, adminRoute, getAllOrders);
router.put("/:id", protectRoute, adminRoute, updateOrderStatus);

export default router;