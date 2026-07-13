const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/role.middleware");
router.post("/", auth, isAdmin, userController.createUser);
router.get("/", auth, isAdmin, userController.getUsers);
router.get("/:id", auth, isAdmin, userController.getUser);
router.put("/:id", auth, isAdmin, userController.updateUser);
router.delete("/:id", auth, isAdmin, userController.deleteUser);

module.exports = router;