const puppeteer = require('puppeteer')
const path = require('path')

const { EventEmitter } = require('events');
const { URL } = require('url');

const bypasses = require('./bypasses.json');



class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}


(async() => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      `--load-extension=${path.join(__dirname, '../build/FastForward.chromium')}`
    ],
    ignoreDefaultArgs: ['--disable-extensions', '--enable-automation']
  });

  // We do not need to view the FastForward site
  browser.on('targetcreated', async target => {
    if (target.url() === 'https://fastforward.team/firstrun') {
      const targetPage = await target.page()
      targetPage.close()
      return;
    }
  })
  const page = await browser.newPage()
  await page.setRequestInterception(true);
  // A custom EventEmitter to emit url changes
  const urlEmitter = new EventEmitter()
  page.on('request', request => {
    const url = new URL(request.url())
    urlEmitter.emit('change', url.host)
    request.continue();
  })

  const waitForDomain = (domain, timeoutms) => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new TimeoutError(`Timeout limit of ${timeoutms}ms has been exceeded`))
      }, timeoutms)
      const listener = urlEmitter.on('change', changedURL => {
        if (domain === changedURL) {
          clearTimeout(timeout)
          resolve();
          urlEmitter.removeListener('change', listener);
        }
      })
    })
  }

  // Wait 3 seconds for FastForward to load
  setTimeout(async () => {
    for (const url in bypasses) {
      const destination = bypasses[url].destination
      const timeout = bypasses[url].timeout || 5000
      console.log(`⌛ Testing "${url}" with expected destination "${destination}"`)
      await page.goto(url)
      await waitForDomain(destination, timeout)
        .then(() => {
          console.log(`✔️  Success`)
        })
        .catch(err => {
          console.log(`❌ Failed at ${url}. ${err.message}`)
          process.exit(1)
        })
    }
    console.log('✓ All bypasses have passed the test!')
  }, 3000)


})()
