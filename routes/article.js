const express = require("express");
const { handleAsync } = require("../handleErrors/handleAsync");
const { admin } = require("../middleware/admin");
const { uploadSingle } = require("../middleware/Multer");
const { uploadImage } = require("../middleware/firebase");
const router = express.Router();

const articleRouter = (articleController) => {
  router.get(
    "/",
    handleAsync(async (req, res) => {
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 6;
      const skip = (page - 1) * limit;
      const endIndex = page * limit;

      const { articles, noOfDocuments } =
        await articleController.getAllArticles(skip, limit);

      const pagination = {
        currentPage: page,
        limit,
        numberPages: Math.ceil(noOfDocuments / limit),
        noOfDocuments,
      };

      if (endIndex < noOfDocuments) {
        pagination.nextPage = page + 1;
      }

      if (skip > 0) {
        pagination.prevPage = page - 1;
      }

      res.status(200).json({ success: true, pagination, data: articles });
    })
  );
  router.get(
    "/newest",
    handleAsync(async (req, res) => {
      const articles = await articleController.getNewestArticle();

      res.status(200).json({ success: true, data: articles });
    })
  );
  router.post(
    "/",
    uploadSingle,
    uploadImage,
    admin,
    handleAsync(async (req, res) => {
      const newArticle = await articleController.createArticle(req.body);
      res.status(201).json({ success: true, data: newArticle });
    })
  );

  router.patch(
    "/:id",
    uploadSingle,
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
