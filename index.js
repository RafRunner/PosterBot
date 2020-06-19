const { quitDriver } = require('./src/webdriver/webdriver');
const PostFetcher = require('./src/facebook/PostFetcher');
const Bot = require('./src/twitter/Bot');
const pageService = require('./src/services/pageService');
const postService = require('./src/services/postService');

const facebookPage = (() => {
  if (process.argv.length !== 3) {
    throw new Error('Incorrect use of the bot! you have to provide the facebook page URL when starting the program: node index.js page_url');
  }
  return process.argv[2];
})();

async function cloningPostsJob(fireDate) {
  console.log('Starting post cloning job at: ' + fireDate);
  console.log('Starting facebook bot and fetching posts...');

  try {
    await (async () => {
      let page = await pageService.getFromUrl(facebookPage);
      if (!page) {
        console.log('Registering page: ' + facebookPage + ' in the database');
        if (!(await pageService.create(facebookPage))) {
          console.log('Error registering page: ' + facebookPage + ' in the database, finishing job');
          return;
        }
        page = await pageService.getFromUrl(facebookPage);
      }

      const lastPostOnDatabase = await postService.getLastPostFromPage(page);

      const postFetcher = await new PostFetcher(facebookPage);
      const newPosts = await postFetcher.fetchLoadedPosts((post, i) => lastPostOnDatabase.equals(post));

      if (newPosts.length === 0) {
        console.log('No posts were fetched to clone on twitter\n');
        return;
      }

      const twitterBot = new Bot();
      await twitterBot.authenticate();
      console.log('Starting to tweet facebook posts on twitter\n');

      for (const newPost of newPosts) {
        if (await postService.exists(newPost, page)) {
          console.log('Post: ' + newPost.elementId + ' has already been cloned, continuing');
          continue;
        }

        console.log('Posting post: ' + newPost.elementId + ' on Twitter');
        try {
          await twitterBot.post(newPost);
          console.log('Post: ' + newPost.elementId + ' twetted successfully\n');
          await postService.create(newPost, page);
        } catch (e) {
          console.log('Error posting post: ' + newPost.elementId + ' on twitter, continuing\n');
          console.log(e);
          continue;
        }
      }
    })();
  } catch (e) {
    console.log('An unexpected error has stopped this post cloning job...\n', e);
  } finally {
    console.log('Post cloning started at: ' + fireDate + ' has finished!\n\n\n');
    await quitDriver();
  }
}

cloningPostsJob(new Date());
