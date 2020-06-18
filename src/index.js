const { quitDriver } = require('./webdriver/webdriver');
const PostFetcher = require('./facebook/PostFetcher');
const Bot = require('./twitter/Bot');
const schedule = require('node-schedule');

const j = schedule.scheduleJob('30 12 * * *', async (fireDate) => {
  console.log('Starting post cloning job at: ' + fireDate);
  console.log('Starting facebook bot and fetching posts...');

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
});
