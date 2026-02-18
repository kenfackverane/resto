//Meme principe avec adminRoute

const express = require("express");
const foodController = require("../controllers/foodController");
const adminAuthMiddleware = require("../middlewares/adminMiddleware");
const router = express.Router();

router.post("/food/new", adminAuthMiddleware, foodController.addFood);
router.get("/foods", /*adminAuthMiddleware,*/ foodController.getAllFoods);
router.get("/food/:id", adminAuthMiddleware, foodController.getFoodDetails);
router.put("/food/:id", adminAuthMiddleware, foodController.updateFood);
router.delete("/food/:id", adminAuthMiddleware, foodController.deleteFood);

module.exports = router;
