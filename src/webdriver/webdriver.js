const { Builder } = require('selenium-webdriver');

let driver = null;

module.exports = {
  async getDriver() {
    if (driver === null) {
      driver = await new Builder().forBrowser('chrome').build();
      await driver.manage().window().maximize();
    }
    return driver;
  },

  async quitDriver() {
    if (driver === null) {
      return;
    }
    await driver.quit();
    driver = null;
  },
};
