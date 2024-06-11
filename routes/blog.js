const express = require("express");
const { handleAsync } = require("../handleErrors/handleAsync");
const { admin } = require("../middleware/admin");
const { uploadSingle } = require("../middleware/Multer");
const { uploadImage } = require("../middleware/firebase");
const router = express.Router();

const blogRouter = (blogController) => {
  router.get(
    "/",
    handleAsync(async (req, res) => {
      const blogs = await blogController.getAllBlogs();

      res.status(200).json({ success: true, data: blogs });
    })
  );
  router.get(
    "/newest",
    handleAsync(async (req, res) => {
      const blogs = await blogController.getNewestBlog();

      res.status(200).json({ success: true, data: blogs });
    })
  );
  router.post(
    "/",
    uploadSingle,
    uploadImage,
    admin,
    handleAsync(async (req, res) => {
      const newBlog = await blogController.createBlog(req.body);
      res.status(201).json({ success: true, data: newBlog });
    })
  );

  router.patch(
    "/:id",
    uploadSingle,
    uploadImage,
    admin,
    handleAsync(async (req, res) => {
      await blogController.updateBlog(req.params.id, req.body);
      res
        .status(200)
        .json({ success: true, data: "blog updated successfully" });
    })
  );
  router.delete(
    "/:id",
    admin,
    handleAsync(async (req, res) => {
      await blogController.deleteBlogById(req.params.id);
      res
        .status(200)
        .json({ success: true, data: "blog deleted successfully" });
    })
  );

  return router;
};

module.exports = blogRouter;
