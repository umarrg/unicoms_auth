const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./connections/connection.mongo")();

const tokenMiddleware =
  require("./middlewares/middleware.token").tokenMiddleware;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());



app.use(express.json());


app.get("/", (req, res) => {
  res
    .status(200)
    .json({ status: "success", payload: "Unicoms......." });
})


const authRoute = require("./routes/auth")();
app.use("/api/v1/auth", authRoute)


app.use(tokenMiddleware());

const userRoute = require("./routes/users")();
app.use("/api/v1/user", userRoute);



//Admin Route
const adminRoute = require("./routes/route.admin")();
app.use("/api/admin", adminRoute);

app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "",
  });
});

const PORT = process.env.PORT | 9000;

app.listen(
  PORT,
  console.log(
    `Server running on port ${PORT}`
  )
)

