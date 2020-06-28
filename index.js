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

      const postFetcher = await new PostFetcher(facebookPage);
      const newPosts = await postFetcher.fetchLoadedPosts((post, i) => false);

      if (newPosts.length === 0) {
        console.log('No posts were fetched to clone on twitter\n');
        return;
      }

      const twitterBot = new Bot();
      await twitterBot.authenticate();
      console.log('Starting to tweet facebook posts on twitter\n');

      for (const newPost of newPosts) {
        const dbPost = await postService.get(newPost, page);
        if (dbPost && dbPost.tweet_id && (await twitterBot.tweetExists(dbPost.tweet_id))) {
          console.log('Post: ' + newPost.elementId + ' has already been cloned and still exists, continuing\n');
          continue;
        }

        console.log('Posting post: ' + newPost.elementId + ' on Twitter');
        try {
          const tweetId = await twitterBot.post(newPost);
          console.log('Post: ' + newPost.elementId + ' twetted successfully\n');
          const postId = await postService.create(newPost, page);
          await postService.updateTweetId(postId, tweetId);
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
