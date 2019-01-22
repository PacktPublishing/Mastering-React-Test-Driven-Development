import { app } from '../../server/src/app';
import { setWorldConstructor } from 'cucumber';
import puppeteer from 'puppeteer';

class World {
  constructor() {
    this.pages = {};
  }

  setPage(name, page) {
    this.pages[name] = page;
  }

  getPage(name) {
    return this.pages[name];
  }

  startServer() {
    const port = process.env.PORT || 3000;
    this.server = app.listen(port);
  }

  closeServer() {
    Object.keys(this.pages).forEach(name =>
      this.pages[name].browser().close()
    );
    this.server.close();
  }

  async browseToPageFor(role, url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    this.setPage(role, page);
  }
}

setWorldConstructor(World);
