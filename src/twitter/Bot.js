'use-strict';

const Twit = require('twit');
const tokens = require('../auth/twitterTokens');

class Bot {
  constructor() {
    this.twitter = new Twit(tokens);
  }

  authenticate() {
    this.twitter.get(
      'account/verify_credentials',
      {
        include_entities: false,
        skip_status: true,
        include_email: false,
      },
      (err, res) => {
        if (err) {
          console.log('Error authenticating bot');
          throw err;
        }
        console.log('Authentication successful. Running bot...\n');
      }
    );
  }

  post(post) {
    const params = {};

    if (post.imageURL !== '') {
      params.media_ids = [this.uploadMidia(post)];
    }

    params.status = post.text;
    this.twitter.post('statuses/update', params, (err, data, response) => {
      if (err) {
        console.log('Error posting twett from post: ' + post.elementId);
        throw err;
      }
      console.log('Post: ' + post.elementId + ' twetted successfully');
    })
  }

  uploadMidia(post) {
    const b64content = post.getEncoded64Image();
    const mediaId;

    this.twitter.post('media/upload', { media_data: b64content }, (err, data, response) => {
      if (err) {
        console.log('Error uploading post media. Image: ' + post.imageURL + ' from post: ' + post.elementId);
        throw err;
      }
      const mediaIdStr = data.media_id_string;
      const meta_params = { media_id: mediaIdStr, alt_text: { text: '' } };

      this.twitter.post('media/metadata/create', meta_params, (err, data, response) => {
        if (err) {
          console.log('Error creating post media. Image: ' + post.imageURL + ' from post: ' + post.elementId);
          throw err;
        }
        
        mediaId = mediaIdStr;
      });
    });

    return mediaId;
  }
}

module.exports = Bot;
