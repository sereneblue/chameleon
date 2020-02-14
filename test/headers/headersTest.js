const { Builder, By } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

const browserData = require('../../src/js/data.js')
const expect = require('chai').expect
const express = require('express')
const path = require('path')
const app = express()
const auth = require('http-auth')

var basic = auth.basic({ realm: 'SECRET LAIR'}, (username, password, callback) => {
	callback(username == 'username' && password == 'password');
});

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

describe('Headers', () => {
	before(async () => {
		extPath = path.join(__dirname, '../{3579f63b-d8ee-424f-bbb6-6d0ce3285e6a}.xpi');
		EXTENSION_URI = "";
		LOCALSERVER = "http://chameleon1.test:3000";
		SLEEP_TIME = 300;

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
		app.use(allowCrossDomain);
		app.get('/', (req, res) => res.send(req.headers) );
		app.get('/ref_test', (req, res) => res.render('index'));
		app.get('/basic_auth', basic.check((req, res) => {
      res.send('Permission granted');
    }));
		app.get('/auth_test', (req, res) => {
			res.send(`
				<html>
					<body>
						<img src="/basic_auth">
					</body>
				</html>
			`);
		});
		app.get('/etags', (req, res) => {
			res.setHeader("Etag", Math.random().toString(36));
			res.send('test');
		});
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
		await driver.get(EXTENSION_URI);
		await driver.findElement(By.id('menu_headers')).click()
		await wait(SLEEP_TIME);
		await selectHeaderOption('input[name="disableAuth"]');

		await driver.get("http://username:password@localhost:3000/basic_auth");
		let source = await driver.getPageSource();
		expect(source.includes("granted")).to.be.true;

		await driver.get("http://localhost:3000/auth_test");
		
		let alertPresent = false;
		try {
			await driver.switchTo().alert().then((alert) => alert.dismiss());
			alertPresent = true;
		} catch (e) {
			// alert not present
		}

		expect(alertPresent).to.be.false;
	});

	it('should enable do not track', async () => {
		await selectHeaderOption('input[name="enableDNT"]');
		await checkHeaders('dnt', '1');
	});

	it('should prevent etag tracking', async () => {
		await selectHeaderOption('input[name="blockEtag"]');

		let etag = await driver.executeAsyncScript(function() {
			var callback = arguments[arguments.length - 1];
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "http://localhost:3001/", true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					callback(xhr.getResponseHeader("Etag"));
				}
			};
			xhr.send('');
		});

		expect(etag).to.equal(null);
	});

	it('should spoof header ip (random)', async () => {
		await selectHeaderOption('input[name="spoofIP"]');

		await driver.get(LOCALSERVER);
		let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

		expect(response.via).to.not.equal("");
	});

	it('should spoof header ip (custom)', async () => {
		await driver.executeScript(`
			el = document.querySelector('select[name="spoofIPValue"]');
			el.value = 1;
			el.dispatchEvent(new Event('change'));

			el = document.querySelector('input[name="rangeFrom"]');
			el.value = "1.1.1.1";
			el.dispatchEvent(new Event('keyup'));

			el = document.querySelector('input[name="rangeTo"]');
			el.value = "1.1.1.1";
			el.dispatchEvent(new Event('keyup'));
		`);

		await driver.get(LOCALSERVER);
		let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

		expect(response.via).to.equal("1.1 1.1.1.1");
		expect(response["x-forwarded-for"]).to.equal("1.1.1.1");
	});

	it('should show referer', async () => {
		await driver.get(LOCALSERVER + "/ref_test");
		await driver.findElement(By.id('link')).click();

		let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');
		expect(response.referer).to.equal(LOCALSERVER + "/ref_test");
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

	it('should spoof source referer', async () => {
		await selectHeaderOption('input[name="spoofSourceRef"]');

		await driver.get(LOCALSERVER + "/ref_test");
		await driver.findElement(By.id('link')).click();

		let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

		await driver.get(EXTENSION_URI);
		await driver.executeScript(`document.querySelector('input[name="spoofSourceRef"]').click()`);
		expect(response.referer).to.equal(LOCALSERVER + "/");
	});

	it('should disable referer', async () => {
		await selectHeaderOption('input[name="disableRef"]');
		await checkHeaders('referer', undefined);

		await driver.get(EXTENSION_URI);
		await driver.executeScript(`document.querySelector('input[name="disableRef"]').click()`);
	});

	it('should upgrade insecure requests', async () => {
		await selectHeaderOption('input[name="upgradeInsecureRequests"]');
		await checkHeaders('upgrade-insecure-requests', '1');
	});

	it('spoof accept header', async () => {
		await selectHeaderOption('input[name="spoofAccept"]');
		await checkHeaders('accept-encoding', 'gzip, deflate');
	});

	browserData.languages.forEach(function(l, i) {
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