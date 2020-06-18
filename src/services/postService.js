const serviceHelper = require('./serviceHelper');

const postsTable = 'posts';

module.exports = {
  async get(id) {
    return serviceHelper.get(id, postsTable);
  },

  async create(post) {
    return serviceHelper.create(post, postsTable);
  },

  async exists(id) {
    return serviceHelper.exists(id, postsTable);
  },

  async delete(id) {
    return serviceHelper.delete(id, postsTable);
  },
};
