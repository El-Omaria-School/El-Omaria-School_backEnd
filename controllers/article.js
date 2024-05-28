const validationError = require("../handleErrors/validationError");
const validator = require("../validations/article");

class ArticleController {
  constructor(articleRepository) {
    this.articleRepository = articleRepository;
  }

  async createArticle(body) {
    const { error } = validator.validatArticle(body);
    if (error) {
      throw new validationError(`In valid data ${error.message}`);
    }

    return await this.articleRepository.createNewArticle(body);
  }

  async getAllArticles() {
    return await this.articleRepository.getAllArticles();
  }
  async updateArticle(id, body) {
    return await this.articleRepository.updateArticle(id, body);
  }

  async deleteArticleById(id) {
    return await this.articleRepository.deleteArticleById(id);
  }
}
module.exports = ArticleController;
