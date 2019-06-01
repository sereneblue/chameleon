const { Builder } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

const browserData = require('../../src/js/data.js')
const expect = require('chai').expect
const express = require('express')
const path = require('path')
const app = express()

const wait = async (sec) => {
	return new Promise(resolve => setTimeout(resolve, sec));
}

const checkUA = async (uas) => {
	await driver.get(LOCALSERVER);

	let navUA = await driver.executeScript('return window.navigator.userAgent;');
	expect(uas.includes(navUA)).to.be.true;

	let reqUA = await driver.executeScript('return document.querySelector("#useragent").innerText;');
	expect(uas.includes(reqUA)).to.be.true;
}

const loopProfiles = (profiles, display) => {
	profiles.forEach(function(u, i) {
		it(`should use ${display} profile [${i + 1}/${profiles.length}]`, async () => {
			await selectProfile(`input[value="${u.value}"]`);
			await checkUA([u.ua]);
		});
	});
}

const selectProfile = async (selector) => {
	await driver.executeScript(`document.querySelector('${selector}').click()`);
	
	let isChecked = await driver.executeScript(`return document.querySelector('${selector}').checked`);
	expect(isChecked).to.be.true;

	await wait(SLEEP_TIME);
}

describe('Profiles', () => {
	before(async () => {
		extPath = path.join(__dirname, '../{3579f63b-d8ee-424f-bbb6-6d0ce3285e6a}.xpi');
		EXTENSION_URI = "";
		LOCALSERVER = "http://localhost:3000";
		SLEEP_TIME = 300;

		driver = await new Builder()
			.forBrowser('firefox')
			.setFirefoxOptions(
				new firefox.Options()
				.setBinary('firefox-developer-edition')
				.addExtensions(extPath)
				.setPreference('xpinstall.signatures.required', false)
				.headless())
			.build();

	    await driver.get('about:debugging#/runtime/this-firefox');

		await wait(SLEEP_TIME);

		EXTENSION_URI = await driver.executeScript(`
			return Array
			.from(document.querySelectorAll('.card.debug-target-item'))
			.filter(e => e.querySelector('span.debug-target-item__name').title == "Chameleon")[0]
			.querySelector('.qa-manifest-url').href.replace('manifest.json', 'popup.html');`
		);

		app.set('view engine', 'ejs')
		app.set('views', __dirname);
		app.get('/', (req, res) => res.render('index', { useragent: req.headers['user-agent'] }));

		server = app.listen(3000);
	});

	beforeEach(async () => { 
		await driver.get(EXTENSION_URI);
		await wait(SLEEP_TIME);
	});

	after(async () => {
	    await driver.quit();
		server.close();
	});

	it('should do nothing', async () => {
		await driver.get(LOCALSERVER);

		let navUA = await driver.executeScript('return window.navigator.userAgent');
		let reqUA = await driver.executeScript('return document.querySelector("#useragent").innerText');

		expect(navUA).to.equal(reqUA);
	});

	it('should use a random profile', async () => {
		let uas = browserData.uaList.win.concat(browserData.uaList.mac, browserData.uaList.linux, browserData.uaList.ios, browserData.uaList.android).map(u => u.ua);

		await selectProfile('input[value="random"]');
		await checkUA(uas);
	});

	it('should change user agent after 1 minute', async () => {
		let uas = browserData.uaList.win.concat(browserData.uaList.mac, browserData.uaList.linux, browserData.uaList.ios, browserData.uaList.android).map(u => u.ua);

		await selectProfile('input[value="random"]');
		await driver.executeScript(`
			el = document.querySelector('#interval > select:nth-child(2)');
			el.value = 1;
			el.dispatchEvent(new Event('change'));
		`);
		await wait(SLEEP_TIME);

		await driver.get(LOCALSERVER);
		let firstUA = await driver.executeScript('return window.navigator.userAgent;');
		
		await wait(61000);

		await driver.get(LOCALSERVER);
		let secondUA = await driver.executeScript('return window.navigator.userAgent;');

		expect(firstUA).to.not.equal(secondUA);
	});

	it('should use a random desktop profile', async () => {
		let uas = browserData.uaList.win.concat(browserData.uaList.mac, browserData.uaList.linux).map(u => u.ua);

		await selectProfile('input[value="randomDesktop"]');
		await checkUA(uas);
	});

	it('should use a random mobile profile', async () => {
		let uas = browserData.uaList.ios.concat(browserData.uaList.android).map(u => u.ua);

		await selectProfile('input[value="randomMobile"]');
		await checkUA(uas);
	});

	it('should use a Windows profile', async () => {
		let uas = browserData.uaList.win.map(u => u.ua);

		await selectProfile('input[value="random_win"]');
		await checkUA(uas);
	});

	it('should exclude all but 1 Windows profile', async () => {
		let u = browserData.uaList.win[Math.floor(Math.random() * browserData.uaList.win.length)];

		await driver.executeScript(`
			el = document.querySelector('#list_win .excludeall input');
			el.checked = true;
			el.dispatchEvent(new Event('click'));

			el = document.querySelector('input[name="exc_${u.value}"]');
			el.checked = false;
			el.dispatchEvent(new Event('change'));
		`);

		await selectProfile('input[value="random_win"]');
		await checkUA([u.ua]);
	});

	loopProfiles(browserData.uaList.win, "Windows");

	it('should use a macOS profile', async () => {
		let uas = browserData.uaList.mac.map(u => u.ua);

		await selectProfile('input[value="random_mac"]');
		await checkUA(uas);
	});

	it('should exclude all but 1 macOS profile', async () => {
		let u = browserData.uaList.mac[Math.floor(Math.random() * browserData.uaList.mac.length)];

		await driver.executeScript(`			
			el = document.querySelector('#list_mac .excludeall input');
			el.checked = true;
			el.dispatchEvent(new Event('click'));

			el = document.querySelector('input[name="exc_${u.value}"]');
			el.checked = false;
			el.dispatchEvent(new Event('change'));
		`);

		await selectProfile('input[value="random_mac"]');
		await checkUA([u.ua]);
	});

	loopProfiles(browserData.uaList.mac, "macOS");

	it('should use a Linux profile', async () => {
		let uas = browserData.uaList.linux.map(u => u.ua);

		await selectProfile('input[value="random_linux"]');
		await checkUA(uas);
	});

	it('should exclude all but 1 Linux profile', async () => {
		let u = browserData.uaList.linux[Math.floor(Math.random() * browserData.uaList.linux.length)];

		await driver.executeScript(`			
			el = document.querySelector('#list_linux .excludeall input');
			el.checked = true;
			el.dispatchEvent(new Event('click'));

			el = document.querySelector('input[name="exc_${u.value}"]');
			el.checked = false;
			el.dispatchEvent(new Event('change'));
		`);

		await selectProfile('input[value="random_linux"]');
		await checkUA([u.ua]);
	});

	loopProfiles(browserData.uaList.linux, "Linux");

	it('should use an iOS profile', async () => {
		let uas = browserData.uaList.ios.map(u => u.ua);

		await selectProfile('input[value="random_ios"]');
		await checkUA(uas);
	});

	it('should exclude all but 1 iOS profile', async () => {
		let u = browserData.uaList.ios[Math.floor(Math.random() * browserData.uaList.ios.length)];

		await driver.executeScript(`			
			el = document.querySelector('#list_ios .excludeall input');
			el.checked = true;
			el.dispatchEvent(new Event('click'));

			el = document.querySelector('input[name="exc_${u.value}"]');
			el.checked = false;
			el.dispatchEvent(new Event('change'));
		`);

		await selectProfile('input[value="random_ios"]');
		await checkUA([u.ua]);
	});

	loopProfiles(browserData.uaList.ios, "iOS");

	it('should use an Android profile', async () => {
		let uas = browserData.uaList.android.map(u => u.ua);

		await selectProfile('input[value="random_android"]');
		await checkUA(uas);
	});

	it('should exclude all but 1 Android profile', async () => {
		let u = browserData.uaList.android[Math.floor(Math.random() * browserData.uaList.android.length)];

		await driver.executeScript(`			
			el = document.querySelector('#list_android .excludeall input');
			el.checked = true;
			el.dispatchEvent(new Event('click'));

			el = document.querySelector('input[name="exc_${u.value}"]');
			el.checked = false;
			el.dispatchEvent(new Event('change'));
		`);

		await selectProfile('input[value="random_android"]');
		await checkUA([u.ua]);
	});

	loopProfiles(browserData.uaList.android, "Android");

	it('should use a custom user agent', async () => {
		let ua = "Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16";

		await selectProfile('input[value="custom"]');

		await driver.executeScript(`
			el = document.querySelector('#list_custom > div > input:nth-child(2)');
			el.value = "${ua}";
			el.dispatchEvent(new Event('keyup'));
		`);

		await wait(SLEEP_TIME);
		await checkUA([ua]);
	});
});