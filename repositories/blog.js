const NotFoundError = require("../handleErrors/notFoundError");
const { deleteImages } = require("../middleware/firebase");
const Blog = require("../models/Blog");

class BlogRepository {
  async createNewBlog(body) {
    const blog = await Blog.create(body);
    return blog;
  }

  async getAllBlogs() {
    const blog = await Blog.find();
    if (!blog) throw new NotFoundError("Not found blog!");

    return blog.reverse();
  }

  async getNewestBlog() {
    const blog = await Blog.find();
    if (!blog) throw new NotFoundError("Not found blog!");

    return blog.reverse().slice(0, 2);
  }

  async updateBlog(id, body) {
    const blog = await Blog.findById(id);
    if (!blog) throw new NotFoundError("blog not Found!");

    if (body.image) {
      await deleteImages(blog.image);
    }

    const updated = await Blog.updateOne({ _id: id }, body);

    return updated;
  }

  async deleteBlogById(id) {
    const blog = await Blog.findById(id);
    if (!blog) throw new NotFoundError("blog not Found!");
    await deleteImages(blog.image);
    const deleted = await Blog.findByIdAndDelete(id);

    return deleted;
  }
}
module.exports = BlogRepository;
