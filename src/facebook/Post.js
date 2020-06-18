const { post } = require('selenium-webdriver/http');

var request = require('request').defaults({ encoding: null });

class Post {
  constructor(elementId, text, imageURL) {
    this.elementId = elementId;
    this.text = text;
    this.imageURL = imageURL;
  }

  equals(otherPost) {
    return this.elementId == otherPost.elementId;
  }

  getEncoded64Image() {
    if (this.imageURL === '') {
      throw new Error('Post: ' + this.elementId + ' has no image to be fetched');
    }

    request.get(this.imageURL, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        throw new Error('Error fetching image: ' + this.imageURL + ' from post: ' + this.elementId);
      }
      data = 'data:' + response.headers['content-type'] + ';base64,' + Buffer.from(body).toString('base64');
      return data;
    });
  }
}

module.exports = Post;
