const NotFoundError = require("../handleErrors/notFoundError");
const { deleteImages } = require("../middleware/firebase");
const article = require("../models/Article");

class ArticleRepository {
  async createNewArticle(body) {
    const Article = await article.create(body);
    return Article;
  }

  async getAllArticles() {
    const Article = await article.find();
    if (!Article) throw new NotFoundError("Not found article!");

    return Article.reverse();
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

  async deleteArticleById(id) {
    const Article = await article.findById(id);
    if (!Article) throw new NotFoundError("Article not Found!");
    await deleteImages(Article.image);
    const deleted = await article.findByIdAndDelete(id);

    return deleted;
  }
}
module.exports = ArticleRepository;
