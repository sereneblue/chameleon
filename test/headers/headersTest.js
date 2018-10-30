const { Builder, By } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

const expect = require('chai').expect
const express = require('express')
const path = require('path')
const uaList = require('../../src/js/data.js')
const app = express()
const auth = require('http-auth');

var authMiddleware = auth.connect(auth.basic({ realm: 'SECRET LAIR'}, (username, password, callback) => {
	callback(username == 'username' && password == 'password');
}));

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    next();
}

const wait = async (sec) => {
	return new Promise(resolve => setTimeout(resolve, sec));
}

const selectHeaderOption = async (selector) => {
	await driver.executeScript(`document.querySelector('${selector}').click()`);

	let isChecked = await driver.executeScript(`return document.querySelector('${selector}').checked`);
	expect(isChecked).to.be.true;

	await wait(SLEEP_TIME);
}

const checkHeaders = async (field, expected) => {
	await driver.get(LOCALSERVER);

	let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

	expect(response[field]).to.equal(expected);
}

const languages = [
	{ display: 'ar', value: 'ar'},
	{ display: 'da-DK', value: 'da-DK,da;q=0.5'},
	{ display: 'de-DE', value: 'de-DE,de;q=0.5'},
	{ display: 'en-GB', value: 'en-GB,en;q=0.5'},
	{ display: 'en-US', value: 'en-US,en;q=0.5'},
	{ display: 'es-ES', value: 'es-ES,es;q=0.5'},
	{ display: 'fr-FR', value: 'fr-FR,fr;q=0.5'},
	{ display: 'hi-IN', value: 'hi-IN,hi;q=0.5'},
	{ display: 'id-ID', value: 'id-ID,id;q=0.5'},
	{ display: 'it-IT', value: 'it-IT,it;q=0.5'},
	{ display: 'ja-JP', value: 'ja-JP,en-US;q=0.5'},
	{ display: 'ko-KR', value: 'ko-KR,ko;q=0.8'},
	{ display: 'pt-BR', value: 'pt-BR,pt;q=0.9'},
	{ display: 'pt-PT', value: 'pt-PT,pt;q=0.9'},
	{ display: 'ru-RU', value: 'ru-RU,ru;q=0.5'},
	{ display: 'sv-SE', value: 'sv-SE,en-US;q=0.5'},
	{ display: 'zh-CN', value: 'zh-CN,zh;q=0.5'},
	{ display: 'zh-TW', value: 'zh-TW,zh;q=0.5'}
];

describe('Headers', () => {
	before(async () => {
		extPath = path.join(__dirname, '../{3579f63b-d8ee-424f-bbb6-6d0ce3285e6a}.xpi');
		EXTENSION_URI = "";
		LOCALSERVER = "http://localhost:3000";
		SLEEP_TIME = 600;

		driver = await new Builder()
			.forBrowser('firefox')
			.setFirefoxOptions(
				new firefox.Options()
				.setBinary('firefox-developer-edition')
				.addExtensions(extPath)
				.setPreference('xpinstall.signatures.required', false)
				.setPreference('devtools.jsonview.enabled', false)
				.headless())
			.build();

	    await driver.get('about:debugging');

		EXTENSION_URI = await driver.executeScript(`
			return Array
			.from(document.querySelectorAll('.addon-target-container'))
			.filter(e => e.dataset.addonId == "{3579f63b-d8ee-424f-bbb6-6d0ce3285e6a}")[0]
			.querySelector('.manifest-url').href.replace('manifest.json', 'popup.html');`
		);

		app.set('view engine', 'ejs')
		app.set('views', __dirname);
		app.use(allowCrossDomain);
		app.get('/', (req, res) => res.send(req.headers) );
		app.get('/', (req, res) => res.send(req.headers) );
		app.get('/ref_test', (req, res) => res.render('index'));
		app.get('/basic_auth', authMiddleware, (req, res) => res.send('Permission granted'));
		app.get('/etags', (req, res) => res.send('test'));
		server = app.listen(3000);
		cors_server = app.listen(3001);
	});

	beforeEach(async () => {
		await driver.get(EXTENSION_URI);
		await driver.findElement(By.id('menu_headers')).click()
		await wait(SLEEP_TIME);
	});

	after(async () => {
	    await driver.quit();
		server.close();
		cors_server.close();
	});

	it('should disable authorization header', async () => {
		await selectHeaderOption('input[name="disableAuth"]');

		await driver.get("http://username:password@localhost:3000/basic_auth");
		let source = await driver.getPageSource();
		expect(source.includes("granted")).to.be.true;

		await driver.get(LOCALSERVER + "/basic_auth");
		try {
			let modal = await driver.switchTo().activeElement();
			await modal.dismiss();
		} catch (e) {

		}
		source = await driver.getPageSource();
		expect(source.includes("Unauthorized")).to.be.true;
	});

	it('should enable do not track', async () => {
		await selectHeaderOption('input[name="enableDNT"]');
		await checkHeaders('dnt', '1');
	});

	it('should have via ip (random)', async () => {
		await selectHeaderOption('input[name="spoofVia"]');

		await driver.get(LOCALSERVER);
		let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

		expect(response.via).to.not.equal("");
	});

	it('should have via ip (custom)', async () => {
		await driver.executeScript(`
			el = document.querySelector('select[name="spoofViaValue"]');
			el.value = 1;
			el.dispatchEvent(new Event('change'));

			el = document.querySelector('input[name="viaIP"]');
			el.value = "1.1.1.1";
			el.dispatchEvent(new Event('keyup'));
		`);

		await driver.get(LOCALSERVER);
		let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

		expect(response.via).to.equal("1.1 1.1.1.1");
	});

	it('should have x-forwarded-for (random)', async () => {
		await selectHeaderOption('input[name="spoofXFor"]');

		await driver.get(LOCALSERVER);
		let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

		expect(response["x-forwarded-for"]).to.not.equal("");
	});

	it('should have x-forwarded-for (custom)', async () => {
		await driver.executeScript(`
			el = document.querySelector('select[name="spoofXForValue"]');
			el.value = 1;
			el.dispatchEvent(new Event('change'));

			el = document.querySelector('input[name="xforwardedforIP"]');
			el.value = "1.1.1.1";
			el.dispatchEvent(new Event('keyup'));
		`);

		await driver.get(LOCALSERVER);
		let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

		expect(response["x-forwarded-for"]).to.equal("1.1.1.1");
	});

	it('should show referer', async () => {
		await driver.get(LOCALSERVER + "/ref_test");
		await driver.findElement(By.id('link')).click();

		let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');
		expect(response.referer).to.equal(LOCALSERVER + "/ref_test");
	});

	it('should disable referer', async () => {
		await selectHeaderOption('input[name="disableRef"]');
		await checkHeaders('referer', undefined);

		await driver.get(EXTENSION_URI);
		await driver.executeScript(`document.querySelector('input[name="disableRef"]').click()`);
	});

	it('should spoof source referer', async () => {
		await selectHeaderOption('input[name="spoofSourceRef"]');

		await driver.get(LOCALSERVER + "/ref_test");
		await driver.findElement(By.id('link')).click();

		let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

		await driver.get(EXTENSION_URI);
		await driver.executeScript(`document.querySelector('input[name="spoofSourceRef"]').click()`);
		expect(response.referer).to.equal(LOCALSERVER + "/");
	});

	it('should send full referer (xorigin referer)', async () => {
		await driver.executeScript(`
			el = document.querySelector('select[name="refererXorigin"]');
			el.value = 0;
			el.dispatchEvent(new Event('change'));
		`);

		await wait(SLEEP_TIME);
		await driver.get(LOCALSERVER + "/ref_test?funding=secured");

		let res = await driver.executeAsyncScript(function() {
			var callback = arguments[arguments.length - 1];
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "http://localhost:3001/", true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					callback(JSON.parse(xhr.responseText));
				}
			};
			xhr.send('');
		});

		expect(res.referer).to.equal(LOCALSERVER + "/ref_test?funding=secured");
	});

	it('should match base domain (xorigin referer)', async () => {
		await driver.executeScript(`
			el = document.querySelector('select[name="refererXorigin"]');
			el.value = 1;
			el.dispatchEvent(new Event('change'));
		`);

		await wait(SLEEP_TIME);
		await driver.get(LOCALSERVER + "/ref_test?funding=secured");

		let res = await driver.executeAsyncScript(function() {
			var callback = arguments[arguments.length - 1];
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "http://127.0.0.1:3001/", true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					callback(JSON.parse(xhr.responseText));
				}
			};
			xhr.send('');
		});

		expect(res.referer).to.equal(undefined);
	});

	it('should match host (xorigin referer)', async () => {
		await driver.executeScript(`
			el = document.querySelector('select[name="refererXorigin"]');
			el.value = 2;
			el.dispatchEvent(new Event('change'));
		`);

		await wait(SLEEP_TIME);
		await driver.get(LOCALSERVER + "/ref_test?funding=secured");

		let res = await driver.executeAsyncScript(function() {
			var callback = arguments[arguments.length - 1];
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "http://127.0.0.1:3001/", true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					callback(JSON.parse(xhr.responseText));
				}
			};
			xhr.send('');
		});

		expect(res.referer).to.equal(undefined);
	});

	it('should use full uri for referer ', async () => {
		await driver.executeScript(`
			el = document.querySelector('select[name="refererTrimming"]');
			el.value = 0;
			el.dispatchEvent(new Event('change'));
		`);
		await driver.get(LOCALSERVER + "/ref_test?funding=secured");
		await driver.findElement(By.id('link')).click();

		let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');
		expect(response.referer).to.equal(LOCALSERVER + "/ref_test?funding=secured");
	});

	it('should use scheme, host, port and path for referer ', async () => {
		await driver.executeScript(`
			el = document.querySelector('select[name="refererTrimming"]');
			el.value = 1;
			el.dispatchEvent(new Event('change'));
		`);
		await driver.get(LOCALSERVER + "/ref_test");
		await driver.findElement(By.id('link')).click();

		let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');
		expect(response.referer).to.equal(LOCALSERVER + "/ref_test");
	});

	it('should use scheme, host and port for referer ', async () => {
		await driver.executeScript(`
			el = document.querySelector('select[name="refererTrimming"]');
			el.value = 2;
			el.dispatchEvent(new Event('change'));
		`);
		await driver.get(LOCALSERVER + "/ref_test");
		await driver.findElement(By.id('link')).click();

		let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');
		expect(response.referer).to.equal(LOCALSERVER);
	});

	it('should upgrade insecure requests', async () => {
		await selectHeaderOption('input[name="upgradeInsecureRequests"]');
		await checkHeaders('upgrade-insecure-requests', '1');
	});

	it('spoof spoof accept encoding', async () => {
		await selectHeaderOption('input[name="spoofAcceptEnc"]');
		await checkHeaders('accept-encoding', 'gzip, deflate');
	});

	languages.forEach(function(l, i) {
		it(`should spoof language: ${l.display}`, async () => {
			await driver.executeScript(`
				var el = document.querySelector('input[name="spoofAcceptLang"]')
				el.checked = true;
				el.dispatchEvent(new Event('click'));

				el = document.querySelector('select[name="spoofAcceptLangValue"]');
				el.value = "${l.value}";
				el.dispatchEvent(new Event('change'));
			`);

			await wait(SLEEP_TIME);
			await checkHeaders("accept-language", l.value.toLowerCase());
		});
	});
});