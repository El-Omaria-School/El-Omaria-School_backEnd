const validationError = require("../handleErrors/validationError");
const validator = require("../validations/blog");

class BlogController {
  constructor(blogRepository) {
    this.blogRepository = blogRepository;
  }

  async createBlog(body) {
    const { error } = validator.validatBlog(body);
    if (error) {
      throw new validationError(`In valid data ${error.message}`);
    }

    return await this.blogRepository.createNewBlog(body);
  }

  async getAllBlogs() {
    return await this.blogRepository.getAllBlogs();
  }
  async getNewestBlog() {
    return await this.blogRepository.getNewestBlog();
  }
  async updateBlog(id, body) {
    return await this.blogRepository.updateBlog(id, body);
  }

  async deleteBlogById(id) {
    return await this.blogRepository.deleteBlogById(id);
  }
}
module.exports = BlogController;
