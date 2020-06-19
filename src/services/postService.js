const connection = require('../database/connection');

const postsTable = 'posts';

module.exports = {
  async exists(post, page) {
    const exists = await connection(postsTable).where({ element_id: post.elementId, page_id: page.id }).select('id').first();
    return exists && true;
  },

  async create(post, page) {
    const dbPost = { element_id: post.elementId, text: post.text, image_url: post.imageURLs, page_id: page.id };
    const [id] = await connection(postsTable).insert(dbPost);
    return id;
  },
};
