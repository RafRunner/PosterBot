const connection = require('../database/connection');
const Post = require('../facebook/Post');

const postsTable = 'posts';

module.exports = {
  async exists(post, page) {
    const exists = await this.get(post, page, 'id');
    return exists.id;
  },

  async get(post, page, selectedFields = '*') {
    const dbPost = await connection(postsTable).where({ element_id: post.elementId, page_id: page.id }).select(selectedFields).first();
    return dbPost;
  },

  async updateTweetId(postId, tweetId) {
    return connection(postsTable).where('id', postId).update('tweet_id', tweetId);
  },

  async create(post, page) {
    const exists = await this.exists(post, page);
    if (exists) {
      return exists;
    }

    const dbPost = { element_id: post.elementId, text: post.text, image_url: post.imageURLs, page_id: page.id };
    const [id] = await connection(postsTable).insert(dbPost);
    return id;
  },
};
