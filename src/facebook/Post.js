class Post {
  constructor(id, text, imageURL) {
    this.id = id;
    this.text = text;
    this.imageURL = imageURL;
  }

  equals(otherPost) {
    return this.id == otherPost.id;
  }
}

module.exports = Post;
