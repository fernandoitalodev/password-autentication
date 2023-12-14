require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Welcome to our API!" });
});

app.get("/user/:id",checkToken, async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id, "-password");
  // this will return the id, but no the password
  if (!user) {
    return res.status(404).json({ msg: "User not found!" });
  }
  res.status(200).json({user})
});

//transforming the /user/:id in a private route
function checkToken(req,res,next){
    const authHeader= req.headers['authorization']
    const token= authHeader && authHeader.split(' ')[1]
    //the authHeader will be a string like this "dddd d4334", the token is the second part of the string and the .split method will split the two words in an array and the [1] will take the token

    if(!token){
        return res.status(401).json({msg: "Access denied!"})
    }

    try {
        const secret = process.env.SECRET

        jwt.verify(token,secret)
        next()
    } catch (error) {
        res.status(400).json({msg: "Invalid Token!"})
        
    }

}

app.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  //validations
  if (!name) {
    return res.status(422).json({ msg: "The name is mandatory!" });
    //status 422 says that the server understands the request but cannot process it due to semantic error in the request. in our code without the name is not possible create a user profile
  }
  if (!email) {
    return res.status(422).json({ msg: "Email is mandatory!" });
  }
  if (!password) {
    return res.status(422).json({ msg: "The password is mandatory!" });
  }
  if (password !== confirmpassword) {
    return res
      .status(422)
      .json({ msg: "The password and the confirm password must be equals!" });
  }

  //Check is the user exists
  const userExists = await User.findOne({ email: email });
  if (userExists) {
    return res
      .status(422)
      .json({ msg: "Already exists a user with this email, try another." });
  }

  //Creating a safe password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  //create user
  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();
    // this will save the user in the database
    res.status(201).json({ msg: "The user was created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error in the server" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(422).json({ msg: "Email is mandatory!" });
  }
  if (!password) {
    return res.status(422).json({ msg: "The password is mandatory!" });
  }

  //check if user exists

  const userProfile = await User.findOne({ email: email });
  if (!userProfile) {
    return res.status(422).json({ msg: "User not found!" });
  }

  //check if password match
  const checkPassword = await bcrypt.compare(password, userProfile.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Invalid password" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: userProfile._id,
      },
      secret
    );
    res
      .status(200)
      .json({ msg: "Authentication completed successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error in the server" });
  }
});

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.kl9jcfn.mongodb.net/`
  )
  .then(() => {
    app.listen(3000);
    console.log("Connected to Database!");
  })
  .catch((e) => console.log(e));
