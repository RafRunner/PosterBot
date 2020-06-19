const connection = require('../database/connection');

const pagesTable = 'pages';

module.exports = {
  async getFromUrl(url) {
    return connection(pagesTable).where('url', url).select('*').first();
  },

  async create(url) {
    const [id] = await connection(pagesTable).insert({ url });
    return id;
  },
};
