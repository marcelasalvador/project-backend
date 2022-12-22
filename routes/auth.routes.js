const express = require("express")
const { 
    signupController, 
    loginController, 
    deleteController, 
    updateController
} = require("../controllers/auth.controllers")

const { isAuthenticated } = require("../middleware/jwt.middleware")
const User = require("../models/User.model")


const router = express.Router()



router.post("/signup", signupController)
router.post("/login", loginController )
router.delete("/delete", isAuthenticated, deleteController)
router.put("/update", isAuthenticated, updateController )

router.get("/verify", isAuthenticated, (req,res,next) => {
    console.log(req.myPayload);
    res.status(200).json(req.myPayload)

})



module.exports = router