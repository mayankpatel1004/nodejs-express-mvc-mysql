const {createUser, getUserByUserId, getUsers, updateUsers, deleteUser,login, excelRead, excelWrite,exportUsers} = require("./user.controller");
const router = require("express").Router();
const { checkToken } = require('../../auth/token_validation');

router.get("/", checkToken, getUsers);
router.post("/", checkToken, createUser);
router.get('/excelread',checkToken,excelRead);
router.get('/excelwrite',checkToken,excelWrite);
router.get('/exportusers',checkToken,exportUsers);
router.get("/:id", checkToken, getUserByUserId);
router.patch("/", checkToken, updateUsers);
router.delete("/", checkToken, deleteUser);
router.post('/login', login);

module.exports = router;