const { By, Key, until } = require('selenium-webdriver');
const { getDriver, quitDriver } = require('./webdriver/webdriver');
const PostFetcher = require('./facebook/PostFetcher');
const { post } = require('selenium-webdriver/http');

(async function example() {
  let driver = await getDriver();
  try {
    const postFetcher = await new PostFetcher('https://www.facebook.com/pg/memesbocamole/posts/?ref=page_internal');

    const posts = await driver.findElements(By.className('_1dwg _1w_m _q7o'));
    console.log('Number of loaded posts: ', posts.length);

    for (var i = 0; i < 3; i++) {
      const post = posts[i];
      const text = await post.findElement(By.css('p'));
      const image = await post.findElement(By.className('scaledImageFitWidth img'));
      const postId = await post.findElement(By.className('_5pcp _5lel _2jyu _232_'));

      console.log('Id: ', await postId.getAttribute('id'));
      console.log('Text: ', await text.getText());
      console.log('Image: ', await image.getAttribute('src'));
      console.log('\n');
    }
  } catch (e) {
    console.log('Pipocou:');
    console.log(e);
  } finally {
    await quitDriver();
  }
})();
