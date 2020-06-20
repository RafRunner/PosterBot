const { By, Key, until } = require('selenium-webdriver');
const { getDriver } = require('../webdriver/webdriver');
const Post = require('./Post');

class PostFetcher {
  constructor(pageURL) {
    return new Promise(async (resolve, reject) => {
      try {
        this.driver = await getDriver();
        await this.driver.get(pageURL);
        // Time for the posts to load
        await this.driver.sleep(3000);
      } catch (ex) {
        return reject(ex);
      }
      resolve(this);
    });
  }

  async loadPostImages(postElement) {
    const imageElements = await postElement.findElements(By.css('img'));
    let imageURLs = '';

    for (let i = 1; i < imageElements.length && i < 5; i++) {
      const imageURL = await imageElements[i].getAttribute('src');
      imageURLs += imageURL + ',';
    }

    return imageURLs;
  }

  async scrollToPost(postElement) {
    await this.driver.executeScript('arguments[0].scrollIntoView(true);', postElement);
    await this.driver.sleep(10000);
  }

  async fetchLoadedPosts(stopCondition) {
    const posts = [];

    try {
      let postElements = await this.driver.findElements(By.className('_1dwg _1w_m _q7o'));
      const nPreLoadedPosts = postElements.length;
      await this.scrollToPost(postElements[nPreLoadedPosts - 1]);

      let i = 0;
      while (i < nPreLoadedPosts) {
        const postElement = postElements[i];

        const postIdElement = await postElement.findElement(By.className('_5pcp _5lel _2jyu _232_'));
        const postId = await postIdElement.getAttribute('id');

        try {
          let postText;
          postElement
            .findElement(By.css('p'))
            .getText()
            .then((text) => (postText = text))
            .catch(() => (postText = ''));
          const postImages = await this.loadPostImages(postElement);

          if (!postText && !postImages) {
            continue;
          }

          const post = new Post(postId, postText, postImages);

          if (stopCondition(post, i)) {
            console.log('Post: ' + postId + ' on index ' + i + ' has no fetchable content\n');
            break;
          }
          console.log('Post: ' + postId + ' on index ' + i + ' fetched successfully\n');
          posts.push(post);
        } catch {
          console.log('Failled to load elements of post: ' + postId + ' on index ' + i);
          console.log(e, '\n');
          continue;
        } finally {
          i++;
        }
      }
    } catch (e) {
      console.log('Error loading post elements: ', e);
    } finally {
      return posts.reverse();
    }
  }
}

module.exports = PostFetcher;
