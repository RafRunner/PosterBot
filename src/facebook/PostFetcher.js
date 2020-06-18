const { By, Key, until } = require('selenium-webdriver');
const { getDriver } = require('../webdriver/webdriver');
const Post = require('./Post');

class PostFetcher {
  static expectedStopReasons = ['stopConditionMet', 'noMorePreLoadedPosts', 'reachedNonLoadedPosts'];

  constructor(pageURL) {
    return new Promise(async (resolve, reject) => {
      try {
        this.driver = await getDriver();
        await this.driver.get(pageURL);
        // Time for the posts to load
        await this.driver.sleep(1000);
      } catch (ex) {
        return reject(ex);
      }
      resolve(this);
    });
  }

  async fetchLoadedPosts(lastPostLoaded, stopCondition) {
    const driver = this.driver;
    const posts = [];
    let stopReason = 'stopConditionMet';

    try {
      const postsElements = await driver.findElements(By.className('_1dwg _1w_m _q7o'));
      const nPreLoadedPosts = postsElements.length;

      let i = 0;
      while (true) {
        if (i == nPreLoadedPosts) {
          stopReason = 'noMorePreLoadedPosts';
          break;
        }

        const postElement = postsElements[i];

        try {
          const postIdElement = await postElement.findElement(By.className('_5pcp _5lel _2jyu _232_'));
          const postId = await postIdElement.getAttribute('id');

          if (lastPostLoaded && lastPostLoaded.id != postId) {
            continue;
          }

          let postText = '';
          postElement
            .findElement(By.css('p'))
            .getText()
            .then((text) => (postText = text))
            .catch();

          let postImage = '';
          postElement
            .findElement(By.className('scaledImageFitWidth img'))
            .getAttribute('src')
            .then((image) => (postImage = Image))
            .catch();

          if (postText === '' && postImage === '') {
            stopReason = 'reachedNonLoadedPosts';
            break;
          }

          const post = new Post(postId, postText, postImage);
          posts.push(post);

          if (stopCondition(post)) {
            break;
          }
        } catch {
          stopReason = 'reachedNonLoadedPosts';
          break;
        }
        i++;
      }
    } catch (e) {
      console.log(e);
      stopReason = e.message;
    } finally {
      return { posts, stopReason };
    }
  }
}

module.exports = PostFetcher;
