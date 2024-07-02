const express = require("express");
const router = express.Router();
const {
    createNewOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrder,
    deleteOrder
} = require("../controller/orderController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

router.route("/order/new").post(isAuthenticated, createNewOrder);

router.route("/order/:id").get(isAuthenticated, getSingleOrder);

router.route("/orders/me").get(isAuthenticated, myOrders);

router.route("/admin/orders").get(isAuthenticated, authorizeRoles("admin"), getAllOrders);

router.route("/admin/order/:id")
    .put(isAuthenticated, authorizeRoles("admin"), updateOrder)
    .delete(isAuthenticated, authorizeRoles("admin"), deleteOrder);

module.exports = router;