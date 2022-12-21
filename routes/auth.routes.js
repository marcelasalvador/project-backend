const express = require("express")
const { signupController, loginController } = require("../controllers/auth.controllers")

const { isAuthenticated } = require("../middleware/jwt.middleware")
const User = require("../models/User.model")


const router = express.Router()

router.get("/test", (req,res) => {
    User.find()
    .then((result) => {
        res.json(result)
    })
    .catch(err => console.log(err))
})
router.post("/signup", signupController)
router.post("/login", loginController )
router.get("/verify", isAuthenticated, (req,res,next) => {
    console.log(req.myPayload);
    res.status(200).json(req.myPayload)

})



module.exports = router