const { Builder, By, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const extData = require('../package.json');
const path = require('path');
const languages = require('../src/lib/language');

const wait = async sec => {
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
};

// default wait after changing settings
// gives time for the extension changes to be updated
const defaultExtWait = async () => {
  return wait(0.5);
};

const MAIN_URL = 'http://chameleon1.test:3000';
const MAIN_URL2 = 'http://test.chameleon1.test:3000';
const EXT_URL = 'http://chameleon2.test:3000';

let driver, getWithWait;
let POPUP_URL, OPTIONS_URL;

jest.setTimeout(120000);

describe('Test browser headers', () => {
  beforeAll(async () => {
    driver = await new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(
        new firefox.Options()
          .setBinary('firefox-developer-edition')
          .setPreference('xpinstall.signatures.required', false)
          .setPreference('devtools.jsonview.enabled', false)
          .addExtensions(path.join(__dirname, `../dist-zip/${extData.name}-v${extData.version}.xpi`))
          .headless()
      )
      .build();

    await driver.get('about:debugging#/runtime/this-firefox');
    await driver.wait(until.elementLocated(By.css('.card.debug-target-item')), 5 * 1000);

    getWithWait = (driver => {
      return async url => {
        await driver.get(url);
        await defaultExtWait();
      };
    })(driver);

    const EXTENSION_URI = await driver.executeScript(`
      return Array
      .from(document.querySelectorAll('.card.debug-target-item'))
      .filter(e => e.querySelector('span.debug-target-item__name').title == "Chameleon")[0]
      .querySelector('.qa-manifest-url').href`);

    POPUP_URL = EXTENSION_URI.replace('manifest.json', 'popup/popup.html');
    OPTIONS_URL = EXTENSION_URI.replace('manifest.json', 'options/options.html');
  });

  afterAll(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    await getWithWait(POPUP_URL);

    // enable chameleon before each test
    let enabled = await driver.executeScript(`return document.querySelector('#chameleonEnabled i').dataset['name'] === 'shield';`);
    if (!enabled) await driver.findElement(By.id('chameleonEnabled')).click();
    await defaultExtWait();

    await driver.findElement(By.id('headersTab')).click();
  });

  test('should enable do not track', async () => {
    await driver.findElement(By.id('enableDNT')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/headers');
    let headers = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

    expect(headers['dnt']).toBe('1');
  });

  test('should enable do not track [disabled]', async () => {
    await driver.findElement(By.id('homeTab')).click();
    await driver.findElement(By.id('chameleonEnabled')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/headers');
    let headers = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

    expect(headers['dnt']).toBeFalsy();
  });

  test('should prevent etag tracking', async () => {
    await getWithWait(MAIN_URL);
    let etag = await driver.executeAsyncScript(`
      var callback = arguments[arguments.length - 1];
      var xhr = new XMLHttpRequest();
      xhr.open("GET", '${MAIN_URL}/etag', true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          callback(xhr.getResponseHeader("etag"));
        }
      };
      xhr.send('');`);

    expect(etag).toBeTruthy();

    await getWithWait(POPUP_URL);
    await driver.findElement(By.id('headersTab')).click();
    await driver.findElement(By.id('blockEtag')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL);

    etag = await driver.executeAsyncScript(`
      var callback = arguments[arguments.length - 1];
      var xhr = new XMLHttpRequest();
      xhr.open("GET", '${MAIN_URL}/etag', true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          callback(xhr.getResponseHeader("etag"));
        }
      };
      xhr.send('');`);

    expect(etag).toBeFalsy();
  });

  test('should prevent etag tracking [disabled]', async () => {
    await driver.findElement(By.id('homeTab')).click();
    await driver.findElement(By.id('chameleonEnabled')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL);

    let etag = await driver.executeAsyncScript(`
      var callback = arguments[arguments.length - 1];
      var xhr = new XMLHttpRequest();
      xhr.open("GET", '${MAIN_URL}/etag', true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          callback(xhr.getResponseHeader("etag"));
        }
      };
      xhr.send('');`);

    expect(etag).toBeTruthy();
  });

  test('should use default accept-language', async () => {
    await getWithWait(MAIN_URL + '/headers');
    let headers = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

    // check language
    await getWithWait(POPUP_URL);
    await driver.findElement(By.id('headersTab')).click();
    await driver.findElement(By.id('spoofAcceptLang')).click();
    await driver.findElement(By.css('#spoofAcceptLangSelect > option:nth-child(2)')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/headers');
    let newHeaders = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

    expect(headers['accept-language']).toBe(newHeaders['accept-language']);
  });

  (() => {
    let lang = languages.getAllLanguages();
    for (let i = 0; i < lang.length; i++) {
      test(`should spoof accept-language [${lang[i].name}]`, async () => {
        await driver.findElement(By.css(`#spoofAcceptLangSelect > option:nth-child(${i + 3})`)).click();
        await defaultExtWait();

        await getWithWait(MAIN_URL + '/headers');
        let headers = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

        expect(headers['accept-language']).toBe(lang[i].value.toLowerCase());

        // TODO: need to check navigator langauges
      });

      test(`should spoof accept-language [${lang[i].name}] [disabled]`, async () => {
        await driver.findElement(By.id('homeTab')).click();
        await driver.findElement(By.id('chameleonEnabled')).click();
        await defaultExtWait();

        await getWithWait(MAIN_URL + '/headers');
        let headers = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

        if (lang[i].code != 'en-US') {
          expect(headers['accept-language']).not.toBe(lang[i].value.toLowerCase());

          // TODO: need to check navigator langauges
        }
      });
    }
  })();

  test('should spoof x-forwarded-for/via ip [random]', async () => {
    await driver.findElement(By.id('spoofIP')).click();
    await driver.findElement(By.css('#spoofIPSelect > option:nth-child(1)')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/headers');
    let headers = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

    expect(headers['x-forwarded-for']).toBeTruthy();
    expect(headers['via']).toBeTruthy();
    expect(headers['via']).toBe('1.1 ' + headers['x-forwarded-for']);
  });

  test('should spoof x-forwarded-for/via ip [random] [disabled]', async () => {
    await driver.findElement(By.id('homeTab')).click();
    await driver.findElement(By.id('chameleonEnabled')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/headers');
    let headers = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

    expect(headers['x-forwarded-for']).toBeFalsy();
    expect(headers['via']).toBeFalsy();
  });

  test('should spoof x-forwarded-for/via ip [custom]', async () => {
    await driver.findElement(By.css('#spoofIPSelect > option:nth-child(2)')).click();
    await driver.findElement(By.id('spoofIPRangeFrom')).sendKeys('8.8.8.8');
    await driver.findElement(By.id('spoofIPRangeTo')).sendKeys('8.8.8.8');
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/headers');

    let headers = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

    expect(headers['x-forwarded-for']).toBe('8.8.8.8');
    expect(headers['via']).toBe('1.1 8.8.8.8');
  });

  test('should spoof x-forwarded-for/via ip [custom] [disabled]', async () => {
    await driver.findElement(By.id('homeTab')).click();
    await driver.findElement(By.id('chameleonEnabled')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/headers');
    let headers = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

    expect(headers['x-forwarded-for']).toBeFalsy();
    expect(headers['via']).toBeFalsy();
  });

  test('should disable referer', async () => {
    await getWithWait(MAIN_URL + '/referer');
    await driver.findElement(By.id('refTest')).click();

    let headers = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');
    expect(headers.referer).toBeTruthy();

    await getWithWait(POPUP_URL);
    await driver.findElement(By.id('headersTab')).click();
    await driver.findElement(By.id('disableReferer')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/referer');
    await driver.findElement(By.id('refTest')).click();

    headers = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');
    expect(headers.referer).toBeFalsy();

    // TODO: Look into document.referer
  });

  test('should disable referer [disabled]', async () => {
    await driver.findElement(By.id('homeTab')).click();
    await driver.findElement(By.id('chameleonEnabled')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/referer');
    await driver.findElement(By.id('refTest')).click();

    let headers = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');
    expect(headers.referer).toBeTruthy();

    await getWithWait(POPUP_URL);
    await driver.findElement(By.id('headersTab')).click();
    await driver.findElement(By.id('disableReferer')).click();
    await defaultExtWait();
  });

  test('should change x origin referer [always send]', async () => {
    await driver.findElement(By.css('#refererXorigin > option:nth-child(1)')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/referer');

    let referer = await driver.executeAsyncScript(`
      var callback = arguments[arguments.length - 1];
      var xhr = new XMLHttpRequest();
      xhr.open("GET", '${EXT_URL}/headers', true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          callback(JSON.parse(xhr.responseText).referer);
        }
      };
      xhr.send('');`);

    expect(referer).toBe(MAIN_URL + '/referer');
  });

  test('should change x origin referer [always send] [disabled]', async () => {
    await driver.findElement(By.id('homeTab')).click();
    await driver.findElement(By.id('chameleonEnabled')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/referer');

    let referer = await driver.executeAsyncScript(`
      var callback = arguments[arguments.length - 1];
      var xhr = new XMLHttpRequest();
      xhr.open("GET", '${EXT_URL}/headers', true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          callback(JSON.parse(xhr.responseText).referer);
        }
      };
      xhr.send('');`);

    expect(referer).toBe(MAIN_URL + '/referer');
  });

  test('should change x origin referer [match base domain]', async () => {
    await driver.findElement(By.css('#refererXorigin > option:nth-child(2)')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/referer');

    let referer = await driver.executeAsyncScript(`
      var callback = arguments[arguments.length - 1];
      var xhr = new XMLHttpRequest();
      xhr.open("GET", '${MAIN_URL2}/headers', true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          callback(JSON.parse(xhr.responseText).referer);
        }
      };
      xhr.send('');`);

    expect(referer).toBeTruthy();
  });

  test('should change x origin referer [match base domain] [disabled]', async () => {
    await driver.findElement(By.id('homeTab')).click();
    await driver.findElement(By.id('chameleonEnabled')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/referer');

    let referer = await driver.executeAsyncScript(`
      var callback = arguments[arguments.length - 1];
      var xhr = new XMLHttpRequest();
      xhr.open("GET", '${MAIN_URL2}/headers', true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          callback(JSON.parse(xhr.responseText).referer);
        }
      };
      xhr.send('');`);

    expect(referer).toBe(MAIN_URL + '/referer');
  });

  test('should change x origin referer [match host]', async () => {
    await driver.findElement(By.css('#refererXorigin > option:nth-child(3)')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/referer');

    let referer = await driver.executeAsyncScript(`
      var callback = arguments[arguments.length - 1];
      var xhr = new XMLHttpRequest();
      xhr.open("GET", '${MAIN_URL2}/headers', true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          callback(JSON.parse(xhr.responseText).referer);
        }
      };
      xhr.send('');`);

    expect(referer).toBeFalsy();
  });

  test('should change x origin referer [match host] [disabled]', async () => {
    await driver.findElement(By.id('homeTab')).click();
    await driver.findElement(By.id('chameleonEnabled')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/referer');

    let referer = await driver.executeAsyncScript(`
      var callback = arguments[arguments.length - 1];
      var xhr = new XMLHttpRequest();
      xhr.open("GET", '${MAIN_URL2}/headers', true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          callback(JSON.parse(xhr.responseText).referer);
        }
      };
      xhr.send('');`);

    expect(referer).toBe(MAIN_URL + '/referer');
  });

  test('should trim referer [send full uri]', async () => {
    await driver.findElement(By.css('#refererTrim > option:nth-child(1)')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/referer?uid=12a2y7yadsf7dsyf7');
    await driver.findElement(By.id('refTest')).click();

    let headers = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');
    expect(headers.referer).toBe('http://chameleon1.test:3000/referer?uid=12a2y7yadsf7dsyf7');
  });

  test('should trim referer [send full uri] [disabled]', async () => {
    await driver.findElement(By.id('homeTab')).click();
    await driver.findElement(By.id('chameleonEnabled')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/referer?uid=12a2y7yadsf7dsyf7');
    await driver.findElement(By.id('refTest')).click();

    let headers = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');
    expect(headers.referer).toBe('http://chameleon1.test:3000/referer?uid=12a2y7yadsf7dsyf7');
  });

  test('should trim referer [scheme, host, port + path]', async () => {
    await driver.findElement(By.css('#refererTrim > option:nth-child(2)')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/referer?uid=12a2y7yadsf7dsyf7');
    await driver.findElement(By.id('refTest')).click();

    let headers = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');
    expect(headers.referer).toBe('http://chameleon1.test:3000/referer');
  });

  test('should trim referer [scheme, host, port + path] [disabled]', async () => {
    await driver.findElement(By.id('homeTab')).click();
    await driver.findElement(By.id('chameleonEnabled')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/referer?uid=12a2y7yadsf7dsyf7');
    await driver.findElement(By.id('refTest')).click();

    let headers = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');
    expect(headers.referer).toBe('http://chameleon1.test:3000/referer?uid=12a2y7yadsf7dsyf7');
  });

  test('should trim referer [scheme, host + port]', async () => {
    await driver.findElement(By.css('#refererTrim > option:nth-child(3)')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/referer?uid=12a2y7yadsf7dsyf7');
    await driver.findElement(By.id('refTest')).click();

    let headers = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');
    expect(headers.referer).toBe('http://chameleon1.test:3000');
  });

  test('should trim referer [scheme, host + port] [disabled]', async () => {
    await driver.findElement(By.id('homeTab')).click();
    await driver.findElement(By.id('chameleonEnabled')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL + '/referer?uid=12a2y7yadsf7dsyf7');
    await driver.findElement(By.id('refTest')).click();

    let headers = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');
    expect(headers.referer).toBe('http://chameleon1.test:3000/referer?uid=12a2y7yadsf7dsyf7');
  });
});
