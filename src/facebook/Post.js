const imageToBase64 = require('image-to-base64');

class Post {
  constructor(elementId, text, imageURLs) {
    this.elementId = elementId;
    this.text = text;
    this.imageURLs = imageURLs;
  }

  equals(o) {
    return this.elementId === o.elementId;
  }

  async getEncoded64Images() {
    if (this.imageURLs === '') {
      return [];
    }
    const URLs = [];

    for (let imageURL of this.imageURLs.split(',')) {
      if (imageURL === '') continue;

      URLs.push(await imageToBase64(imageURL));
    }
    return URLs;
  }
}

module.exports = Post;
