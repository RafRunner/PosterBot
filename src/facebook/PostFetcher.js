const { By, Key, until } = require('selenium-webdriver');
const { getDriver } = require('../webdriver/webdriver');
const Post = require('./Post');

class PostFetcher {
  constructor(pageURL) {
    return new Promise(async (resolve, reject) => {
      try {
        this.driver = await getDriver();
        await this.driver.get(pageURL);
      } catch (ex) {
        return reject(ex);
      }
      resolve(this);
    });
  }

  async getWindowHeighAndY() {
    const rect = await this.driver.manage().window().getRect();
    return { height: rect.height, y: rect.y };
  }

  async webElementIsOnScreen(webElement) {
    const windowVerticalPos = await this.getWindowHeighAndY();
    const elementRect = await webElement.getRect();

    return elementRect.y - (windowVerticalPos.height + windowVerticalPos.y) < 0;
  }

  async fetchMostRecentPosts(stopCondition) {
    const driver = this.driver;
    const posts = [];

    try {
      const posts = await driver.findElements(By.className('_1dwg _1w_m _q7o'));

      for (var i = 0; i < 3; i++) {
        const post = posts[i];
        const textElement = post.findElement(By.css('p'));
        const imageElement = post.findElement(By.className('scaledImageFitWidth img'));

        console.log('Text: ', await textElement.getText());
        console.log('Image: ', await imageElement.getAttribute('src'));
        console.log('\n');
      }
    } catch (e) {
      console.log('Pipocou:');
      console.log(e);
    } finally {
      return posts;
    }
  }

  async loadPostInCurrentPage(lastPostLoaded) {
    try {
      const posts = await driver.findElements(By.className('_1dwg _1w_m _q7o'));

      for (var i = 0; i < 3; i++) {
        const post = posts[i];
        const textElement = post.findElement(By.css('p'));
        const imageElement = post.findElement(By.className('scaledImageFitWidth img'));
        const postId = await post.findElement(By.className('_5pcp _5lel _2jyu _232_'));

        console.log('Text: ', await textElement.getText());
        console.log('Image: ', await imageElement.getAttribute('src'));
        console.log('\n');
      }
    } catch (e) {
      console.log('Pipocou:');
      console.log(e);
    } finally {
      return posts;
    }
  }
}

module.exports = PostFetcher;
