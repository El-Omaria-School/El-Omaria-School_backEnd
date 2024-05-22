require("dotenv").config();
require("./db");
const cors = require("cors");
const { PORT, DB_URL } = require("./constants");

const userRouter = require("./routes/user");
const UserRepository = require("./repositories/user");
const UserController = require("./controllers/user");
const userRepository = new UserRepository();
const userController = new UserController(userRepository);

const express = require("express");
const app = express();
app.use(express.json());
app.use(cors());

const mainRouter = express.Router();
app.use(DB_URL, mainRouter);

mainRouter.use("/user", userRouter(userController));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success: false, message: err.message });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} ....`);
});
