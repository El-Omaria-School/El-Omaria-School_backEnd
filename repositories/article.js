const NotFoundError = require("../handleErrors/notFoundError");
const { deleteImages } = require("../middleware/firebase");
const article = require("../models/Article");

class ArticleRepository {
  async createNewArticle(body) {
    const Article = await article.create(body);
    return Article;
  }

  async getAllArticles(skip, limit) {
    const noOfDocuments = await article.countDocuments();
    const articles = await article
      .find()
      .sort({ dateCreated: -1 })
      .skip(skip)
      .limit(limit);
    if (!articles) throw new NotFoundError("Not found article!");
    return { articles, noOfDocuments };
  }

  async updateArticle(id, body) {
    const Article = await article.findById(id);
    if (!Article) throw new NotFoundError("Article not Found!");
    if (body.image) {
      await deleteImages(Article.image);
    }

    const updated = await article.updateOne({ _id: id }, body);

    return updated;
  }

  async getNewestArticle() {
    const Article = await article.find();
    if (!Article) throw new NotFoundError("Not found article!");

    return Article.reverse().slice(0, 2);
  }

  async deleteArticleById(id) {
    const Article = await article.findById(id);
    if (!Article) throw new NotFoundError("Article not Found!");
    await deleteImages(Article.image);
    const deleted = await article.findByIdAndDelete(id);

    return deleted;
  }
}
module.exports = ArticleRepository;
