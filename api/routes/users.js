const router = require('express').Router();

const checkAuth = require('../middleware/checkAuth');
const userController = require('../controllers/users');

router.get("/", userController.users_get_users);

router.post("/signup", userController.users_signup);

router.post("/login", userController.users_login);

router.delete("/:userId", checkAuth, userController.users_delete_user);

module.exports = router;