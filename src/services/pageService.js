const serviceHelper = require('./serviceHelper');

const pagesTable = 'pages';

module.exports = {
  async get(id) {
    return serviceHelper.get(id, pagesTable);
  },

  async create(page) {
    return serviceHelper.create(page, pagesTable);
  },

  async exists(id) {
    return serviceHelper.exists(id, pagesTable);
  },

  async delete(id) {
    return serviceHelper.delete(id, pagesTable);
  },
};
