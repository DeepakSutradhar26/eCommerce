const express = require("express");
const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetails,
    productReview,
    getAllReviews,
    deleteReviews
} = require("../controller/productController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

// All routes of product
router.route("/products").get(getAllProducts);

router.route("/product/new").post(isAuthenticated, authorizeRoles("admin"), createProduct);

router.route("/admin/product/:id")
    .put(isAuthenticated, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticated, authorizeRoles("admin"), deleteProduct)
    .get(getProductDetails);

router.route("/review").put(isAuthenticated, productReview);

router.route("/reviews")
    .get(getAllReviews)
    .delete(isAuthenticated, deleteReviews);

// End

module.exports = router;