'use-strict';

const Twit = require('twit');
const tokens = require('../auth/twitterTokens');

class Bot {
  constructor() {
    this.twitter = new Twit(tokens);
  }

  async authenticate() {
    const { res } = await this.twitter
      .get('account/verify_credentials', {
        include_entities: false,
        skip_status: true,
        include_email: false,
      })
      .catch((err) => {
        console.log('Error authenticating twitter bot');
        throw err;
      });

    console.log('Authentication successful. Running twitter bot...\n');
  }

  async post(post) {
    const params = { status: post.text };

    if (post.imageURL !== '') {
      params.media_ids = await this.uploadMedias(post);
    }

    const { data } = await this.twitter.post('statuses/update').catch((err) => {
      throw err;
    });

    return data.id_str;
  }

  async tweetExists(tweetId) {
    const params = { id: tweetId, map: true };

    const { data } = await this.twitter.post('statuses/lookup', params).catch((err) => {
      throw err;
    });

    return data.id[tweetId];
  }

  async uploadMedias(post) {
    const mediaIds = [];

    const b64images = await post.getEncoded64Images();

    for (const b64content of b64images) {
      const { data } = await this.twitter.post('media/upload', { media_data: b64content }).catch((err) => {
        console.log('Error uploading post media. Image: ' + post.imageURL + ' from post: ' + post.elementId);
        throw err;
      });

      const mediaIdStr = data.media_id_string;
      const meta_params = { media_id: mediaIdStr };
      await this.createMedia(meta_params);

      mediaIds.push(mediaIdStr);
    }

    return mediaIds;
  }

  async createMedia(meta_params) {
    const { res } = await this.twitter.post('media/metadata/create', meta_params).catch((err) => {
      console.log('Error creating post media. Image: ' + post.imageURL + ' from post: ' + post.elementId);
      throw err;
    });
  }
}

module.exports = Bot;
