require("dotenv").config();
require("./db");
const cors = require("cors");
const { PORT, DB_URL } = require("./constants");

const userRouter = require("./routes/user");
const userProgressRouter = require("./routes/userProgress");
const articleRouter = require("./routes/article");
const blogRouter = require("./routes/blog");
const courseRouter = require("./routes/course");
const lessonRouter = require("./routes/lesson");
const taskRouter = require("./routes/task");

const UserRepository = require("./repositories/user");
const ArticleRepository = require("./repositories/article");
const CourseRepository = require("./repositories/course");
const LessonRepository = require("./repositories/lesson");
const TaskRepository = require("./repositories/task");
const BlogRepository = require("./repositories/blog");

const ArticleController = require("./controllers/article");
const UserController = require("./controllers/user");
const CourseController = require("./controllers/course");
const LessonController = require("./controllers/lesson");
const TaskController = require("./controllers/task");
const UserProgressController = require("./controllers/userProgress");
const BlogController = require("./controllers/blog");

const userRepository = new UserRepository();
const userController = new UserController(userRepository);

const articleRepository = new ArticleRepository();
const articleController = new ArticleController(articleRepository);

const blogRepository = new BlogRepository();
const blogController = new BlogController(blogRepository);

const courseRepository = new CourseRepository();
const courseController = new CourseController(courseRepository);

const lessonRepository = new LessonRepository();
const lessonController = new LessonController(lessonRepository);

const userProgressController = new UserProgressController(
  userRepository,
  lessonRepository
);

const taskRepository = new TaskRepository();
const taskController = new TaskController(taskRepository);

const express = require("express");
const app = express();
app.use(express.json());
app.use(cors());

const mainRouter = express.Router();
app.use(DB_URL, mainRouter);

mainRouter.use("/user", userRouter(userController));
mainRouter.use("/userProgress", userProgressRouter(userProgressController));
mainRouter.use("/article", articleRouter(articleController));
mainRouter.use("/blog", blogRouter(blogController));
mainRouter.use("/course", courseRouter(courseController));
mainRouter.use("/lesson", lessonRouter(lessonController));
mainRouter.use("/task", taskRouter(taskController));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success: false, message: err.message });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} ....`);
});
