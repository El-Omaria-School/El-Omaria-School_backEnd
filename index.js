require("dotenv").config();
require("./db");
const cors = require("cors");
const { PORT, DB_URL } = require("./constants");

const userRouter = require("./routes/user");
const articleRouter = require("./routes/article");

const UserRepository = require("./repositories/user");
const UserController = require("./controllers/user");

const ArticleRepository = require("./repositories/article");
const ArticleController = require("./controllers/article");

const userRepository = new UserRepository();
const userController = new UserController(userRepository);

const articleRepository = new ArticleRepository();
const articleController = new ArticleController(articleRepository);

const express = require("express");
const app = express();
app.use(express.json());
app.use(cors());

const mainRouter = express.Router();
app.use(DB_URL, mainRouter);

mainRouter.use("/user", userRouter(userController));
mainRouter.use("/article", articleRouter(articleController));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success: false, message: err.message });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} ....`);
});
