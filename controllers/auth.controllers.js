const bcryptjs = require("bcryptjs")
const User = require("../models/User.model")
const jwt = require("jsonwebtoken")
// const { isAuthenticated } = require("../middleware/jwt.middleware")


const signupController = (req,res,next) => {

    const { email, name, password } = req.body

    if(! email || !password || !name){
        return res.status(400).json ({
            error: {
                message: "Missing email name or password"
            }
        })
    }

   //insert optional guard statement to check password strength

    bcryptjs.hash(password, 10)
        .then(hashedPassword => {
           return User.create({
            email,
            name,
            password: hashedPassword
           })
        })
        .then(createdUser => {
            res.json(createdUser)
        })
        .catch (err => res.send(err))
}

const loginController = (req,res,next) => {
    const { email, password } = req.body
    if(!email || !password ){
        return res.json({
            error: {
                message: "missing email or password"
            }
        })
    }

    let myUser;

    User.findOne({ email: email})
        .then(foundUser => {
            if(!foundUser) {
                return Promise.reject("Invalid email or password")
            }
            myUser = foundUser
            return bcryptjs.compare(password, foundUser.password)
        })
        .then(isValidPassword => {
            if(!isValidPassword){
                return Promise.reject("invalid email or passowrd ")
            }
            const payload ={
                _id: myUser._id,
                name: myUser.name,
                email: myUser.email
            }
            const authToken = jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                { algorithm: "HS256", expiresIn: "6h" }
            )

            res.json({
                authToken: authToken
            })

        })
        .catch(err => res.send(err))
}

const deleteController = (req, res, next) => {
    const { _id } = req.myPayload;
  
    if (!_id) {
      return res.status(400).json({
        error: {
          message: "Missing user id"
        }
      });
    }
  
    User.findByIdAndDelete(_id)
      .then(deletedUser => {
        if (!deletedUser) {
          return res.status(404).json({
            error: {
              message: "User not found"
            }
          });
        }
        res.json({
          message: "User successfully deleted"
        });
      })
      .catch(err => res.send(err));
  };

  const updateController = (req, res, next) => {
    const { email, name } = req.body
    User.findByIdAndUpdate(req.myPayload._id, {
      name: name,
      email: email,
    }, { new: true })
      .then(updatedUser => {

        const payload ={
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email
        }

        const authToken = jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            { algorithm: "HS256", expiresIn: "6h" }
        )

        res.json({
            authToken: authToken
        });
        
      })
      .catch(err => res.send(err));
  
  };

module.exports = {
    signupController,
    loginController,
    deleteController,
    updateController
}



