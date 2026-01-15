const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { accessChat, fetchChat, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chatController");

const router = express.Router()

router.route('/').post(protect, accessChat);
router.route('/').get(protect, fetchChat);
// router.route('/ai').post(protect, accessAIChat);
router.route('/group').post(protect, createGroupChat);
router.route('/rename').put(protect, renameGroup);
router.route('/groupRemove').put(protect, removeFromGroup);
router.route('/groupAdd').put(protect, addToGroup);

module.exports=router