const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    // common for all
    userType: {
      type: String,
      required: true,
      enum: ["donor", "organization", "hospital", "admin"],
    },

    // name is required if the userType is either donor or admin
    name: {
      type: String,
      required: function () {
        if (this.userType === "admin" || this.userType === "donor") {
          return true;
        }
        return false;
      },
    },

    //   hostpital name is required if the userType is hospital
    hospitalName: {
      type: String,
      required: function () {
        if (this.userType === "hospital") {
          return true;
        }
        return false;
      },
    },

    //   organization name is required if the userType is organization
    organizationName: {
      type: String,
      required: function () {
        if (this.userType === "organization") {
          return true;
        }
        return false;
      },
    },

    //   organization name is required if the userType is organization or hospital
    website: {
      type: String,
      required: function () {
        if (this.userType === "hospital" || this.userType === "organization") {
          return true;
        }
        return false;
      },
    },

    //   organization name is required if the userType is organization or hospital
    address: {
      type: String,
      required: function () {
        if (this.userType === "hospital" || this.userType === "organization") {
          return true;
        }
        return false;
      },
    },

    //   below 3 schemas are common for all
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
