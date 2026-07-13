const express= require('express')
const {isAdmin} = require("../middleware/role.middleware");
const upload = require("../middleware/upload");
const protect = require("../middleware/auth.middleware");

const {uploadLogs,getLogs} = require("../controllers/activity.controller");
const router = express.Router();

router.post("/upload",protect,isAdmin,upload.single("file"),uploadLogs);
router.get("/",protect,isAdmin,getLogs);

module.exports=router;