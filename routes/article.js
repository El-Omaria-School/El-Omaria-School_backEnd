const express = require("express");
const { handleAsync } = require("../handleErrors/handleAsync");
const { admin } = require("../middleware/admin");
const { uploadMultiple } = require("../middleware/Multer");
const { uploadImage } = require("../middleware/firebase");
const router = express.Router();

const articleRouter = (articleController) => {
  router.get(
    "/",
    handleAsync(async (req, res) => {
      const articles = await articleController.getAllArticles();

      res.status(200).json({ success: true, data: articles });
    })
  );
  router.post(
    "/",
    uploadMultiple,
    uploadImage,
    admin,
    handleAsync(async (req, res) => {
      const newArticle = await articleController.createArticle(req.body);
      res.status(201).json({ success: true, data: newArticle });
    })
  );

  router.patch(
    "/:id",
    uploadMultiple,
    uploadImage,
    admin,
    handleAsync(async (req, res) => {
      await articleController.updateArticle(req.params.id, req.body);
      res
        .status(200)
        .json({ success: true, data: "article updated successfully" });
    })
  );
  router.delete(
    "/:id",
    admin,
    handleAsync(async (req, res) => {
      await articleController.deleteArticleById(req.params.id);
      res
        .status(200)
        .json({ success: true, data: "article deleted successfully" });
    })
  );

  return router;
};

module.exports = articleRouter;
