const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  email: { type: String, required: true, index: { unique: true } },
  fname: { type: String, require: true },
  lname: { type: String, require: true },
  phone: { type: String, require: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ["admin", "user"], default: "user" },
  fullName: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

UserSchema.pre("save", function (next) {
  let me = this;
  me.fullName = me.fname + ', ' + me.lname;
  const salt = bcrypt.genSaltSync();
  bcrypt.hash(me.password, salt, (err, encrypted) => {
    if (err) {
      console.log("Bcrypt User Model Password encryption Error", err);
      next();
    } else {
      me.password = encrypted;
      next();
    }
  });
});

module.exports = mongoose.model("User", UserSchema);
