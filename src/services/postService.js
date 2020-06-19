const connection = require('../database/connection');
const Post = require('../facebook/Post');

const postsTable = 'posts';

module.exports = {
  async exists(post, page) {
    const exists = await connection(postsTable).where({ element_id: post.elementId, page_id: page.id }).select('id').first();
    return exists && true;
  },

  async getLastPostFromPage(page) {
    const dbPost = await connection(postsTable).where('page_id', page.id).orderBy('id').select('*').first();
    if (dbPost) {
      return new Post(dbPost.element_id, dbPost.text, dbPost.image_url);
    }
    return new Post('no posts found', '', '');
  },

  async create(post, page) {
    const dbPost = { element_id: post.elementId, text: post.text, image_url: post.imageURLs, page_id: page.id };
    const [id] = await connection(postsTable).insert(dbPost);
    return id;
  },
};
