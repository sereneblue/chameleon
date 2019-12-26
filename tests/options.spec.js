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

describe('Test options', () => {
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

    await driver.findElement(By.id('optionsTab')).click();
  });

  test('should open about:config checklist', async () => {
    let tabs = await driver.getAllWindowHandles();

    await driver.findElement(By.id('aboutConfigChecklist')).click();

    let newTabs = await driver.getAllWindowHandles();

    expect(newTabs.length).toBeGreaterThan(tabs.length);
  });

  test('should enable first party isolation', async () => {
    await driver.findElement(By.id('standardTab')).click();
    await driver.findElement(By.id('firstPartyIsolate')).click();
    await defaultExtWait();

    await driver.navigate().refresh();
    await driver.findElement(By.id('optionsTab')).click();
    await driver.findElement(By.id('standardTab')).click();

    let selected = await driver.findElement(By.id('firstPartyIsolate')).isSelected();

    expect(selected).toBe(true);
  });

  test('should enable resist fingerprinting', async () => {
    await driver.findElement(By.id('standardTab')).click();
    await driver.findElement(By.id('resistFingerprinting')).click();
    await defaultExtWait();

    await driver.navigate().refresh();
    await driver.findElement(By.id('optionsTab')).click();
    await driver.findElement(By.id('standardTab')).click();

    let selected = await driver.findElement(By.css('#resistFingerprinting')).isSelected();

    expect(selected).toBe(true);
  });

  test('should disable webrtc', async () => {
    await getWithWait(MAIN_URL);

    let status = await driver.executeScript('return document.querySelector("#webrtcStatus").innerText;');
    expect(status).toBe('OK');

    await getWithWait(POPUP_URL);

    await driver.findElement(By.id('optionsTab')).click();
    await driver.findElement(By.id('standardTab')).click();
    await driver.findElement(By.id('disableWebRTC')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL);

    status = await driver.executeScript('return document.querySelector("#webrtcStatus").innerText;');
    expect(status).toBe('ERROR');

    // enable webrtc for next tests
    await getWithWait(POPUP_URL);

    await driver.findElement(By.id('optionsTab')).click();
    await driver.findElement(By.id('standardTab')).click();
    await driver.findElement(By.id('disableWebRTC')).click();
    await defaultExtWait();
  });

  test('should change webrtc policy [default]', async () => {
    await driver.findElement(By.id('standardTab')).click();
    await driver.findElement(By.css('#webRTCPolicy > option:nth-child(1)')).click();
    await defaultExtWait();

    await driver.navigate().refresh();
    await driver.findElement(By.id('optionsTab')).click();
    await driver.findElement(By.id('standardTab')).click();

    let selected = await driver.findElement(By.css('#webRTCPolicy > option:nth-child(1)')).isSelected();

    expect(selected).toBe(true);
  });

  test('should change webrtc policy [public and private interface]', async () => {
    await driver.findElement(By.id('standardTab')).click();
    await driver.findElement(By.css('#webRTCPolicy > option:nth-child(2)')).click();
    await defaultExtWait();

    await driver.navigate().refresh();
    await driver.findElement(By.id('optionsTab')).click();
    await driver.findElement(By.id('standardTab')).click();

    let selected = await driver.findElement(By.css('#webRTCPolicy > option:nth-child(2)')).isSelected();

    expect(selected).toBe(true);
  });

  test('should change webrtc policy [only public interface]', async () => {
    await driver.findElement(By.id('standardTab')).click();
    await driver.findElement(By.css('#webRTCPolicy > option:nth-child(3)')).click();
    await defaultExtWait();

    await driver.navigate().refresh();
    await driver.findElement(By.id('optionsTab')).click();
    await driver.findElement(By.id('standardTab')).click();

    let selected = await driver.findElement(By.css('#webRTCPolicy > option:nth-child(3)')).isSelected();

    expect(selected).toBe(true);
  });

  test('should change webrtc policy [non-proxified UDP]', async () => {
    await driver.findElement(By.id('standardTab')).click();
    await driver.findElement(By.css('#webRTCPolicy > option:nth-child(4)')).click();
    await defaultExtWait();

    await driver.navigate().refresh();
    await driver.findElement(By.id('optionsTab')).click();
    await driver.findElement(By.id('standardTab')).click();

    let selected = await driver.findElement(By.css('#webRTCPolicy > option:nth-child(4)')).isSelected();

    expect(selected).toBe(true);
  });

  test('should change tracking protection mode [on]', async () => {
    await driver.findElement(By.id('standardTab')).click();
    await driver.findElement(By.css('#trackingProtectionMode > option:nth-child(1)')).click();
    await defaultExtWait();

    await driver.navigate().refresh();
    await driver.findElement(By.id('optionsTab')).click();
    await driver.findElement(By.id('standardTab')).click();

    let selected = await driver.findElement(By.css('#trackingProtectionMode > option:nth-child(1)')).isSelected();

    expect(selected).toBe(true);
  });

  test('should change tracking protection mode [off]', async () => {
    await driver.findElement(By.id('standardTab')).click();
    await driver.findElement(By.css('#trackingProtectionMode > option:nth-child(2)')).click();
    await defaultExtWait();

    await driver.navigate().refresh();
    await driver.findElement(By.id('optionsTab')).click();
    await driver.findElement(By.id('standardTab')).click();

    let selected = await driver.findElement(By.css('#trackingProtectionMode > option:nth-child(2)')).isSelected();

    expect(selected).toBe(true);
  });

  test('should change tracking protection mode [enabled in private browsing]', async () => {
    await driver.findElement(By.id('standardTab')).click();
    await driver.findElement(By.css('#trackingProtectionMode > option:nth-child(3)')).click();
    await defaultExtWait();

    await driver.navigate().refresh();
    await driver.findElement(By.id('optionsTab')).click();
    await driver.findElement(By.id('standardTab')).click();

    let selected = await driver.findElement(By.css('#trackingProtectionMode > option:nth-child(3)')).isSelected();

    expect(selected).toBe(true);
  });

  test('should change websockets [allow all]', async () => {
    await driver.findElement(By.id('standardTab')).click();
    await driver.findElement(By.css('#websockets > option:nth-child(1)')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL);

    let wsStatus = await driver.executeScript('return document.querySelector("#wsStatus").innerText');
    expect(wsStatus).toBe('OPEN');
  });

  test('should change websockets [allow all] [disabled]', async () => {
    await driver.findElement(By.id('homeTab')).click();
    await driver.findElement(By.id('chameleonEnabled')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL);

    let wsStatus = await driver.executeScript('return document.querySelector("#wsStatus").innerText');
    expect(wsStatus).toBe('OPEN');
  });

  test('should change websockets [block 3rd party]', async () => {
    await driver.findElement(By.id('standardTab')).click();
    await driver.findElement(By.css('#websockets > option:nth-child(2)')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL);

    let wsStatus = await driver.executeScript('return document.querySelector("#wsStatus3rdParty").innerText');
    expect(wsStatus).toBe('CLOSED');
  });

  test('should change websockets [block 3rd party] [disabled]', async () => {
    await driver.findElement(By.id('homeTab')).click();
    await driver.findElement(By.id('chameleonEnabled')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL);

    let wsStatus = await driver.executeScript('return document.querySelector("#wsStatus3rdParty").innerText');
    expect(wsStatus).toBe('OPEN');
  });

  test('should change websockets [block all]', async () => {
    await driver.findElement(By.id('standardTab')).click();
    await driver.findElement(By.css('#websockets > option:nth-child(3)')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL);

    let wsStatus = await driver.executeScript('return document.querySelector("#wsStatus").innerText');
    expect(wsStatus).toBe('CLOSED');
  });

  test('should change websockets [block all] [disabled]', async () => {
    await driver.findElement(By.id('homeTab')).click();
    await driver.findElement(By.id('chameleonEnabled')).click();
    await defaultExtWait();

    await getWithWait(MAIN_URL);
    let wsStatus = await driver.executeScript('return document.querySelector("#wsStatus").innerText');
    expect(wsStatus).toBe('OPEN');
  });

  test('should change cookie policy [allow all]', async () => {
    await driver.findElement(By.id('cookieTab')).click();
    await driver.findElement(By.css('#cookiePolicy > option:nth-child(1)')).click();
    await defaultExtWait();

    await driver.navigate().refresh();
    await driver.findElement(By.id('optionsTab')).click();
    await driver.findElement(By.id('cookieTab')).click();

    let selected = await driver.findElement(By.css('#cookiePolicy > option:nth-child(1)')).isSelected();

    expect(selected).toBe(true);
  });

  test('should change cookie policy [allow visited]', async () => {
    await driver.findElement(By.id('cookieTab')).click();
    await driver.findElement(By.css('#cookiePolicy > option:nth-child(2)')).click();
    await defaultExtWait();

    await driver.navigate().refresh();
    await driver.findElement(By.id('optionsTab')).click();
    await driver.findElement(By.id('cookieTab')).click();

    let selected = await driver.findElement(By.css('#cookiePolicy > option:nth-child(2)')).isSelected();

    expect(selected).toBe(true);
  });

  test('should change cookie policy [reject all]', async () => {
    await driver.findElement(By.id('cookieTab')).click();
    await driver.findElement(By.css('#cookiePolicy > option:nth-child(3)')).click();
    await defaultExtWait();

    await driver.navigate().refresh();
    await driver.findElement(By.id('optionsTab')).click();
    await driver.findElement(By.id('cookieTab')).click();

    let selected = await driver.findElement(By.css('#cookiePolicy > option:nth-child(3)')).isSelected();

    expect(selected).toBe(true);
  });

  test('should change cookie policy [reject third party]', async () => {
    await driver.findElement(By.id('cookieTab')).click();
    await driver.findElement(By.css('#cookiePolicy > option:nth-child(4)')).click();
    await defaultExtWait();

    await driver.navigate().refresh();
    await driver.findElement(By.id('optionsTab')).click();
    await driver.findElement(By.id('cookieTab')).click();

    let selected = await driver.findElement(By.css('#cookiePolicy > option:nth-child(4)')).isSelected();

    expect(selected).toBe(true);
  });

  test('should change cookie policy [reject trackers]', async () => {
    await driver.findElement(By.id('cookieTab')).click();
    await driver.findElement(By.css('#cookiePolicy > option:nth-child(5)')).click();
    await defaultExtWait();

    await driver.navigate().refresh();
    await driver.findElement(By.id('optionsTab')).click();
    await driver.findElement(By.id('cookieTab')).click();

    let selected = await driver.findElement(By.css('#cookiePolicy > option:nth-child(5)')).isSelected();

    expect(selected).toBe(true);
  });
});
