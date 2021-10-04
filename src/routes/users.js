const express = require("express");
const UserDao = require("../Dao/dao.user");
const authorizer = require("../middlewares/middleware.authorizer").authorizer;

module.exports = () => {
  const api = express.Router();

  //Create
  api.post("/", authorizer(["admin", "user"]), async (req, res) => {
    try {
      const savedUser = await UserDao.addNew(req.body);
      res.status(200).json({
        status: "success",
        payload: savedUser,
        message: "User created successfully!",
      });
    } catch (err) {
      res.status(500).json({ status: "failed", payload: null, message: err });
    }
  });

  //read all
  api.get("/", authorizer(["user", "admin"]), async (req, res) => {
    try {
      const usersArray = await UserDao.getAll();
      res.status(200).json({
        status: "success",
        payload: usersArray,
        message: "All Users fetched successfully",
      });
    } catch (err) {
      res.status(500).json({ status: "failed", payload: null, message: err });
    }
  });

  //read one
  api.get("/:id", authorizer(["user", "admin" ]), async (req, res) => {
    const id = req.params.id;
    if (id) {
      try {
        const singleUser = await UserDao.getOne(id);
        res.status(200).json({
          status: "success",
          payload: singleUser,
          message: "Single user fetched Successfully!",
        });
      } catch (err) {
        res.status(500).json({ status: "failed", payload: null, message: err });
      }
    } else {
      res.status(500).json({
        status: "failure",
        payload: null,
        message: "Invalid User id to fetch",
      });
    }
  });

  //update
  api.put("/:id", authorizer(["user", "admin",]), async (req, res) => {
    const id = req.params.id;
    const { password, email, fname, lname, phone } = req.body;
    if (id) {
      try {
        const updatedUser = await UserDao.update(
          id,
          password,
          email,
          fname,
          lname,
          phone
        );
        res.status(200).json({
          status: "success",
          payload: updatedUser,
          message: "Single user Updated Successfully!",
        });
      } catch (err) {
        res.status(500).json({ status: "failed", payload: null, message: err });
      }
    } else {
      res.status(500).json({
        status: "failure",
        payload: null,
        message: "Invalid User id to Update",
      });
    }
  });

  //delete
  api.delete("/:id", authorizer(["admin"]), async (req, res) => {
    const id = req.params.id;

    if (id) {
      try {
        await UserDao.del(id);
        res.status(200).json({
          status: "success",
          payload: null,
          message: "User Deleted Successfully!",
        });
      } catch (err) {
        res.status(500).json({ status: "failed", payload: null, message: err });
      }
    } else {
      res.status(500).json({
        status: "failure",
        payload: null,
        message: "Invalid User id to Delete",
      });
    }
  });
  api.delete("/", authorizer(["admin"]), async (req, res) => {
    try {
      await UserDao.delAll();
      res.status(200).json({
        status: "success",
        payload: null,
        message: "Users Deleted Successfully!",
      });
    } catch (err) {
      res.status(500).json({ status: "failed", payload: null, message: err });
    }
  });

  return api;
};
