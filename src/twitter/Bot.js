'use-strict';

const Twit = require('twit');
const tokens = require('../auth/twitterTokens');

class Bot {
  constructor() {
    this.twitter = new Twit(tokens);
  }

  async authenticate() {
    const { err, res } = await this.twitter.get('account/verify_credentials', {
      include_entities: false,
      skip_status: true,
      include_email: false,
    });

    if (err) {
      console.log('Error authenticating twitter bot');
      throw err;
    }
    console.log('Authentication successful. Running twitter bot...\n');
  }

  async post(post) {
    const params = { status: post.text };

    if (post.imageURL !== '') {
      params.media_ids = await this.uploadMedias(post);
    }

    const { err, data, response } = await this.twitter.post('statuses/update', params);
    if (err) {
      throw err;
    }
  }

  async uploadMedias(post) {
    const mediaIds = [];

    const b64images = await post.getEncoded64Images();

    for (const b64content of b64images) {
      const mediaUploadResponse = await this.twitter.post('media/upload', { media_data: b64content });
      if (mediaUploadResponse.err) {
        console.log('Error uploading post media. Image: ' + post.imageURL + ' from post: ' + post.elementId);
        throw mediaUploadResponse.err;
      }

      const mediaIdStr = mediaUploadResponse.data.media_id_string;
      const meta_params = { media_id: mediaIdStr };
      await this.createMedia(meta_params);

      mediaIds.push(mediaIdStr);
    }

    return mediaIds;
  }

  async createMedia(meta_params) {
    const mediaCreateResponse = await this.twitter.post('media/metadata/create', meta_params);
    if (mediaCreateResponse.err) {
      console.log('Error creating post media. Image: ' + post.imageURL + ' from post: ' + post.elementId);
      throw mediaCreateResponse.err;
    }
  }
}

module.exports = Bot;
