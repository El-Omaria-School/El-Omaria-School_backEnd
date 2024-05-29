const NotFoundError = require("../handleErrors/notFoundError");
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
    // if (body.images) {
    //   await deleteImages(Article.images);
    // }

    const updated = await Author.updateOne({ _id: id }, body);

    return updated;
  }

  async deleteAuthorById(id) {
    const Article = await article.findById(id);
    if (!Article) throw new NotFoundError("Article not Found!");
    // await deleteImages(Article.images);
    // const deleted = await Article.findByIdAndDelete(id);

    return deleted;
  }
}
module.exports = ArticleRepository;
