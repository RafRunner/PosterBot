const { By, Key, until } = require('selenium-webdriver');
const { getDriver, quitDriver } = require('./webdriver/webdriver');
const PostFetcher = require('./facebook/PostFetcher');
const { post } = require('selenium-webdriver/http');

(async function example() {
  try {
    const postFetcher = await new PostFetcher('https://www.facebook.com/pg/memesbocamole/posts/?ref=page_internal');
    const posts = await postFetcher.fetchLoadedPosts(null, (_post) => false);
    console.log(posts);
  } catch (e) {
    console.log('Pipocou:');
    console.log(e);
  } finally {
    await quitDriver();
  }
})();
