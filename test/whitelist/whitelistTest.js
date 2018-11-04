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

const wait = async (sec) => {
	return new Promise(resolve => setTimeout(resolve, sec));
}

const selectOption = async (selector) => {
	await driver.executeScript(`document.querySelector('${selector}').click()`);

	let isChecked = await driver.executeScript(`return document.querySelector('${selector}').checked`);
	expect(isChecked).to.be.true;

	await wait(SLEEP_TIME);
}

describe('Whitelist', () => {
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

		const actions = driver.actions();

	    await driver.get('about:debugging');

		EXTENSION_URI = await driver.executeScript(` 
			return Array
			.from(document.querySelectorAll('.addon-target-container'))
			.filter(e => e.dataset.addonId == "{3579f63b-d8ee-424f-bbb6-6d0ce3285e6a}")[0]
			.querySelector('.manifest-url').href.replace('manifest.json', 'popup.html');`
		);

		app.set('view engine', 'ejs')
		app.set('views', __dirname);

		app.get('/', (req, res) => res.send(req.headers) );
		app.get('/whitelist_test', (req, res) => res.render('index'));
		app.get('/basic_auth', authMiddleware, (req, res) => res.send('Permission granted'));

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

	it('should enable whitelist', async () => {
		await selectOption('input[name="enableWhitelist"]');
		await selectOption('input[name="enableScriptInjection"]');
	});

	it('should add site to whitelist', async () => {
		let domain = await driver.executeScript(`
			document.querySelector('#sub_whitelistRules').click();
			document.querySelector('#addRuleButton').click();
			document.querySelector('#url').value = "${LOCALSERVER}";
			document.querySelector('#saveProfile').click();

			return document.querySelector('div.rulePattern').innerText;
		`);

		expect(domain).to.equal(LOCALSERVER)
	});

	it('should use whitelisted profile', async () => {
		let navProperties = {
			appCodeName: "Mozilla",
			appName: "Netscape",
			appVersion: "5.0 (Windows)",
			hardwareConcurrency: "4",
			oscpu: "Windows NT 10.0",
			platform: "Win64",
			productSub: "20010725",
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:63.0) Gecko/20100101 Firefox/63.0",
			vendor: "",
			vendorSub: ""
		}

		let acceptEnc = "gzip, deflate, br";
		let acceptLang = "en-us,en;q=0.5";

		await driver.executeScript(`
			var ev = new Event('keyup');

			var el = document.querySelector('input[name="wl_useragent"]');
			el.value = "${navProperties.userAgent}";
			el.dispatchEvent(ev);

			el = document.querySelector('input[name="wl_acceptEnc"]');
			el.value = "${acceptEnc}";
			el.dispatchEvent(ev);

			el = document.querySelector('input[name="wl_acceptLang"]');
			el.value = "${acceptLang}";
			el.dispatchEvent(ev);

			el = document.querySelector('input[name="wl_appCodeName"]');
			el.value = "${navProperties.appCodeName}";
			el.dispatchEvent(ev);

			el = document.querySelector('input[name="wl_appName"]');
			el.value = "${navProperties.appName}";
			el.dispatchEvent(ev);

			el = document.querySelector('input[name="wl_appVersion"]');
			el.value = "${navProperties.appVersion}";
			el.dispatchEvent(ev);

			el = document.querySelector('input[name="wl_hardwareConcurrency"]');
			el.value = "${navProperties.hardwareConcurrency}";
			el.dispatchEvent(ev);

			el = document.querySelector('input[name="wl_osCPU"]');
			el.value = "${navProperties.oscpu}";
			el.dispatchEvent(ev);

			el = document.querySelector('input[name="wl_platform"]');
			el.value = "${navProperties.platform}";
			el.dispatchEvent(ev);

			el = document.querySelector('input[name="wl_productSub"]');
			el.value = "${navProperties.productSub}";
			el.dispatchEvent(ev);

			el = document.querySelector('input[name="wl_vendor"]');
			el.value = "${navProperties.vendor}";
			el.dispatchEvent(ev);

			el = document.querySelector('input[name="wl_vendorSub"]');
			el.value = "${navProperties.vendorSub}";
			el.dispatchEvent(ev);
		`);

		await wait(SLEEP_TIME);
		await driver.get(LOCALSERVER);

		let nav = await driver.executeScript(`
			return {
				appCodeName: window.navigator.appCodeName,
				appName: window.navigator.appName,
				appVersion: window.navigator.appVersion,
				hardwareConcurrency: window.navigator.hardwareConcurrency,
				oscpu: window.navigator.oscpu,
				platform: window.navigator.platform,
				productSub: window.navigator.productSub,
				userAgent: window.navigator.userAgent,
				vendor: window.navigator.vendor,
				vendorSub: window.navigator.vendorSub
			};
		`);

		Object.keys(navProperties).forEach((k) => {
			expect(navProperties[k]).to.equal(nav[k]);
		})

		let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

		expect(response["accept-language"]).to.equal(acceptLang);
		expect(response["accept-encoding"]).to.equal(acceptEnc);
	});

	it('should delete whitelist rule', async () => {
		let isDeleted = await driver.executeScript(`
			document.querySelector('#sub_whitelistRules').click();
			document.querySelector('.icon-bin').click();
			
			return document.querySelector('.rulePattern') ? false : true;
		`);

		expect(isDeleted).to.equal(true);
	});

	it('should use real profile for whitelist', async () => {
		await driver.get(LOCALSERVER);
		let navUA = await driver.executeScript('return window.navigator.userAgent;');

		await driver.get(EXTENSION_URI);
		await selectOption('input[value="random"]');

		await driver.get(LOCALSERVER);
		let navUA_spoofed = await driver.executeScript('return window.navigator.userAgent;');

		expect(navUA).to.not.equal(navUA_spoofed);
		
		await driver.get(EXTENSION_URI);
		await selectOption('input[name="enableWhitelistRealProfile"]');

		await driver.executeScript(`
			document.querySelector('#sub_whitelistRules').click();
			document.querySelector('#addRuleButton').click();
			document.querySelector('#url').value = "${LOCALSERVER}";
			document.querySelector('#saveProfile').click();
		`);
		
		await wait(SLEEP_TIME);
		await driver.get(LOCALSERVER);
		let navUA_whitelist = await driver.executeScript('return window.navigator.userAgent;');
		expect(navUA).to.equal(navUA_whitelist);
	});

	it('should test whitelist option - disable authorization', async () => {
		await driver.get("http://username:password@localhost:3000/basic_auth");
		let source = await driver.getPageSource();
		expect(source.includes("granted")).to.be.true;

		// check the page again
		await driver.get("http://username:password@localhost:3000/basic_auth");
		source = await driver.getPageSource();
		expect(source.includes("granted")).to.be.true;

		// disable auth in whitelist
		await driver.get(EXTENSION_URI);
		await driver.executeScript(`
			document.querySelector('#sub_whitelistRules').click();
			document.querySelector('.icon-pencil').click();

			var el = document.querySelector('#rules input[name="authorization"]');
			el.checked = true;
			el.dispatchEvent(new Event('click'));

			document.querySelector('#saveProfile').click();
		`);

		await wait(SLEEP_TIME);
		await driver.get(LOCALSERVER + "/basic_auth");
		try {
			let modal = await driver.switchTo().activeElement();
			await modal.dismiss();
		} catch (e) {}

		source = await driver.getPageSource();
		expect(source.includes("Unauthorized")).to.be.true;
	});

	it('should test whitelist option - disable referer', async () => {
		await driver.get(LOCALSERVER + "/whitelist_test");
		await driver.findElement(By.id('link')).click();

		let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

		expect(response.referer).to.not.equal(undefined);

		await driver.get(EXTENSION_URI);

		// disable referer for whitelisted url
		await driver.executeScript(`
			document.querySelector('#sub_whitelistRules').click();
			document.querySelector('.icon-pencil').click();

			var el = document.querySelector('#rules input[name="referer"]');
			el.checked = true;
			el.dispatchEvent(new Event('click'));

			document.querySelector('#saveProfile').click();
		`);

		await wait(SLEEP_TIME);
		await driver.get(LOCALSERVER + "/whitelist_test");
		await driver.findElement(By.id('link')).click();

		response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

		expect(response.referer).to.equal(undefined);
	});

	it('should test whitelist option - disable websocket', async () => {
		// check websocket
		await driver.get(LOCALSERVER);
		let hasWebsocket = await driver.executeScript(`
			return WebSocket ? true : false;
		`);

		expect(hasWebsocket).to.equal(true);

		await driver.get(EXTENSION_URI);

		// disable websocket for whitelisted url
		await driver.executeScript(`
			document.querySelector('#sub_whitelistRules').click();
			document.querySelector('.icon-pencil').click();

			var el = document.querySelector('#rules input[name="websocket"]');
			el.checked = true;
			el.dispatchEvent(new Event('click'));

			document.querySelector('#saveProfile').click();
		`);

		await wait(SLEEP_TIME);
		await driver.get(LOCALSERVER);
		hasWebsocket = await driver.executeScript(`
			return WebSocket ? true : false;
		`);

		expect(hasWebsocket).to.equal(false);
	});

	it('should test whitelist option - protect window name', async () => {
		await driver.get(LOCALSERVER + "/whitelist_test");
		let curTab = await driver.getWindowHandle();

		await driver.executeScript(`
			document.querySelector('#link2').click();
		`);

		let tabs = await driver.getAllWindowHandles();

		await driver.switchTo().window(tabs[tabs.length - 1])
		let winName = await driver.executeScript(`
			return window.name;
		`);
		await driver.close();

		tabs = await driver.getAllWindowHandles();
		await driver.switchTo().window(tabs[tabs.length - 1])
		
		await driver.get(EXTENSION_URI);
		await driver.executeScript(`
			document.querySelector('#sub_whitelistRules').click();
			document.querySelector('.icon-pencil').click();

			var el = document.querySelector('#rules input[name="winName"]');
			el.checked = true;
			el.dispatchEvent(new Event('click'));

			document.querySelector('#saveProfile').click();
		`);
		await wait(SLEEP_TIME);

		await driver.get(LOCALSERVER + "/whitelist_test");
		await driver.executeScript(`
			document.querySelector('#link2').click();
		`);

		tabs = await driver.getAllWindowHandles();

		await driver.switchTo().window(tabs[tabs.length - 1])
		await wait(SLEEP_TIME);
		let protectedWinName = await driver.executeScript(`
			return window.name;
		`);
		await driver.close();

		tabs = await driver.getAllWindowHandles();
		await driver.switchTo().window(tabs[tabs.length - 1])

		expect(protectedWinName).to.not.equal(winName);
	});

	it('should test whitelist option - spoof screen', async () => {
		await driver.executeScript(`
			var el = document.querySelector('select[name="screenSize"]');
			el.value = "2560x1600";
			el.dispatchEvent(new Event('change'));
		`);

		// original screen resolution
		await wait(SLEEP_TIME);
		await driver.get(LOCALSERVER);
		let screenSize = await driver.executeScript(`
			return {width: window.screen.width, height: window.screen.height}; 
		`);

		await driver.get(EXTENSION_URI);
		await driver.executeScript(`
			document.querySelector('#sub_whitelistRules').click();
			document.querySelector('.icon-pencil').click();

			var el = document.querySelector('#rules input[name="screen"]');
			el.checked = true;
			el.dispatchEvent(new Event('click'));

			document.querySelector('#saveProfile').click();
		`);

		await wait(SLEEP_TIME);
		await driver.get(LOCALSERVER);
		let spoofedScreenSize = await driver.executeScript(`
			return {width: window.screen.width, height: window.screen.height}; 
		`);

		expect(screenSize.width).to.not.equal(spoofedScreenSize.width);
		expect(screenSize.height).to.not.equal(spoofedScreenSize.height);
	});

	it('should test whitelist option - spoof ip headers', async () => {
		await driver.executeScript(`
			document.querySelector('#sub_whitelistRules').click();
			document.querySelector('.icon-pencil').click();

			var el = document.querySelector('#rules input[name="ip"]');
			el.checked = true;
			el.dispatchEvent(new Event('click'));

			document.querySelector('#saveProfile').click();
		`);

		await wait(SLEEP_TIME);
		await driver.get(LOCALSERVER);
		let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

		expect(response.via).to.not.equal("");
		expect(response["x-forwarded-for"]).to.not.equal("");
	});
});