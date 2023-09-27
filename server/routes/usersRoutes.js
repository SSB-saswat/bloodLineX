const router = require("express").Router();
const bcrypt = require("bcryptjs"); //from the frontend we will get the plain password which needs to be converted to hashed key and then we should store the hash password in the database as we should not store the plain password in the database for security purpose. for this encryption purpose we are using this library i.e., bcrypt;
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Inventory = require("../models/inventoryModel");
const mongoose = require("mongoose");

// register new user
router.post("/register", async (req, res) => {
  try {
    // check if the user already exists or not (this can be achieved used email)
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.send({
        success: false,
        message: "User already exists",
      });
    }

    // hash the plain password obtained from the frontend
    const salt = await bcrypt.genSalt(10); // 10 refers to number of rounds
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    // save the user
    const user = new User(req.body);
    await user.save();

    return res.send({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// login a user
router.post("/login", async (req, res) => {
  try {
    // check if the user already exists or not
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

    // check if the userType is matching i.e a hospital or organization cannot sign in as donor and vice versa
    if (user.userType !== req.body.userType) {
      return res.send({
        success: false,
        message: `User is not registered as a ${req.body.userType}`,
      });
    }

    // compare passwords as from the frontend we will obtain the plain password and the db has the hashed password
    // validPassword states whether the passwords are matching or not
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.send({
        success: false,
        message: "Invalid Password",
      });
    }

    // if the password is valid, then we have to write the jwt token code
    //this sign method takes 3 parameters, 1st is data we want to encrypt, 2nd is secret key to encrypt the data, 3rd is for how much time it has validity
    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      expiresIn: "1d",
    });

    return res.send({
      success: true,
      message: "User logged in successfully",
      data: token,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// get current user
router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });

    return res.send({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all unique donors for an organization
router.get("/get-all-donors", authMiddleware, async (req, res) => {
  try {
    // get all unique donor ids from the inventory
    const organization = new mongoose.Types.ObjectId(req.body.userId);
    // const uniqueDonorIds = await Inventory.aggregate([
    //   {
    //     $match: {
    //       inventoryType: "in",
    //       organization,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$donor",
    //     },
    //   },
    // ]);

    // The above way of fetching unique donor ids is complex. So another method is to use distinct method and below is the implemenation
    // here the 1st arguemnet of distinct is the property we want to get and the second one is the condition.
    const uniqueDonorIds = await Inventory.distinct("donor", {
      organization,
    });

    const donors = await User.find({
      _id: { $in: uniqueDonorIds },
    });

    // console.log(uniqueDonorIds);
    return res.send({
      success: true,
      message: "Donors fetched successfully",
      data: donors,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all unique hospitals for an organization
router.get("/get-all-hospitals", authMiddleware, async (req, res) => {
  try {
    // get all unique hospital ids from the inventory
    const organization = new mongoose.Types.ObjectId(req.body.userId);
    const uniqueHospitalsId = await Inventory.distinct("hospital", {
      organization,
    });

    const hospitals = await User.find({
      _id: { $in: uniqueHospitalsId },
    });

    return res.send({
      success: true,
      message: "Hospitals fetched successfully",
      data: hospitals,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all unique organization for a donor i.e., details for the donor profile where the user had donated blood(organization)
router.get(
  "/get-all-organizations-of-a-donor",
  authMiddleware,
  async (req, res) => {
    try {
      // get all unique organization ids from the inventory
      const donor = new mongoose.Types.ObjectId(req.body.userId);
      const uniqueOrganizationsId = await Inventory.distinct("organization", {
        donor,
      });

      const organizations = await User.find({
        _id: { $in: uniqueOrganizationsId },
      });

      return res.send({
        success: true,
        message: "Organizations fetched successfully",
        data: organizations,
      });
    } catch (error) {
      return res.send({
        success: false,
        message: error.message,
      });
    }
  }
);

// get all unique organization for a hospital i.e., details for the hospital profile from where the hospital had consumed blood(organization)
router.get(
  "/get-all-organizations-of-a-hospital",
  authMiddleware,
  async (req, res) => {
    try {
      // get all unique organization ids from the inventory
      const hospital = new mongoose.Types.ObjectId(req.body.userId);
      const uniqueOrganizationsId = await Inventory.distinct("organization", {
        hospital,
      });

      const organizations = await User.find({
        _id: { $in: uniqueOrganizationsId },
      });

      return res.send({
        success: true,
        message: "Organizations fetched successfully",
        data: organizations,
      });
    } catch (error) {
      return res.send({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;
