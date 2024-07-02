const express = require("express");
const {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUserData,
    updatePassword,
    getAllUsers,
    getSingleUser,
    updateUserRole,
    deleteUser } = require("../controller/userController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logoutUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticated, getUserData);

router.route("/password/update").put(isAuthenticated, updatePassword);

router.route("/me/update").put(isAuthenticated, updateUserRole);

router.route("/admin/users").get(isAuthenticated, authorizeRoles("admin"), getAllUsers);

router.route("/admin/user/:id")
    .get(isAuthenticated, authorizeRoles("admin"), getSingleUser)
    .delete(isAuthenticated, authorizeRoles("admin"), deleteUser);

module.exports = router;