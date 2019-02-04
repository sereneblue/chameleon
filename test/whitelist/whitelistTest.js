const { Builder, By } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

const expect = require('chai').expect
const express = require('express')
const path = require('path')
const app = express()
const auth = require('http-auth')
const browserData = require('../../src/js/data.js')

var authMiddleware = auth.connect(auth.basic({ realm: 'SECRET LAIR'}, (username, password, callback) => {
	callback(username == 'username' && password == 'password');
}));

const wait = async (sec) => {
	return new Promise(resolve => setTimeout(resolve, sec));
}

const checkUA = async (uas) => {
	await driver.get(LOCALSERVER);

	let navUA = await driver.executeScript('return window.navigator.userAgent;');
	expect(uas.includes(navUA)).to.be.true;
	
	let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText)');
	expect(navUA).to.equal(response["user-agent"]);
}

const loopProfiles = (profiles) => {
	profiles.forEach(function(u, i) {
		it(`should use ${u.name} as whitelist profile [${i + 1}/${profiles.length}]`, async () => {
			await driver.executeScript(`
				el = document.querySelector('select[name="defaultProfile"]');
				el.value = "${u.value}";
				el.dispatchEvent(new Event('change'));
			`);

			await wait(SLEEP_TIME);
			await checkUA([u.ua]);
		});
	});
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
		await driver.executeScript(`
			document.querySelector('#viewRules').click();
		`);

		await wait(SLEEP_TIME);
		let tabs = await driver.getAllWindowHandles();
		await driver.switchTo().window(tabs[tabs.length - 1]);

		await driver.executeScript(`
			document.querySelector('.header-container button').click();
			document.querySelector('.card-header input').value = "${LOCALSERVER}";
			document.querySelector('.card-header button').click();
		`);

		await wait(SLEEP_TIME);
		let domain = await driver.executeScript(`
			return document.querySelector('#rules .card-title').innerText;
		`);

		await driver.close();
		
		tabs = await driver.getAllWindowHandles();
		await driver.switchTo().window(tabs[tabs.length - 1]);
		
		expect(domain).to.equal(LOCALSERVER)
	});

	it('should delete whitelist rule', async () => {
		await driver.get(EXTENSION_URI.replace('popup.html', 'whitelist.html'));

		await wait(SLEEP_TIME)
		await driver.executeScript(`
			document.querySelector('.card .btn-error').click();
			document.querySelector('.confirmation .btn-success').click();
		`);

		let isDeleted = await driver.executeScript(`
			return document.querySelector('#rules .card') ? false : true;
		`);
		expect(isDeleted).to.equal(true);
	});

	it('should use real profile for whitelist', async () => {
		await driver.get(LOCALSERVER);
		let navUA = await driver.executeScript('return window.navigator.userAgent;');

		await driver.get(EXTENSION_URI);
		await driver.executeScript(`document.querySelector('input[value="random"]').click()`);
		await wait(SLEEP_TIME);

		await driver.get(LOCALSERVER);
		let navUA_spoofed = await driver.executeScript('return window.navigator.userAgent;');

		expect(navUA).to.not.equal(navUA_spoofed);
		
		await driver.get(EXTENSION_URI);
		await driver.executeScript(`
			el = document.querySelector('select[name="defaultProfile"]');
			el.value = "none";
			el.dispatchEvent(new Event('change'));
		`);

		await driver.executeScript(`
			document.querySelector('#viewRules').click();
		`);

		await wait(SLEEP_TIME);
		let tabs = await driver.getAllWindowHandles();
		await driver.switchTo().window(tabs[tabs.length - 1]);

		await driver.executeScript(`
			document.querySelector('.header-container button').click();
			document.querySelector('.card-header input').value = "${LOCALSERVER}";
			document.querySelector('.card-header button').click();
		`);

		await wait(SLEEP_TIME);
		let domain = await driver.executeScript(`
			return document.querySelector('#rules .card-title').innerText;
		`);

		await driver.close();
		
		tabs = await driver.getAllWindowHandles();
		await driver.switchTo().window(tabs[tabs.length - 1]);

		await wait(SLEEP_TIME);
		await driver.get(LOCALSERVER);
		let navUA_whitelist = await driver.executeScript('return window.navigator.userAgent;');
		expect(navUA).to.equal(navUA_whitelist);
	});

	loopProfiles(browserData.profiles);

	it('should test whitelist option - disable authorization', async () => {
		// check the page again
		await driver.get("http://username:password@localhost:3000/basic_auth");
		await driver.get(LOCALSERVER + "/basic_auth");
		source = await driver.getPageSource();
		expect(source.includes("granted")).to.be.true;

		// disable auth in whitelist
		await driver.get(EXTENSION_URI.replace('popup.html', 'whitelist.html'));

		await wait(SLEEP_TIME);
		await driver.executeScript(`
			document.querySelector('.card-header button').click();
			document.querySelectorAll('.card-body input')[0].click();
			document.querySelectorAll('.card-header button')[1].click();
		`);

		await wait(SLEEP_TIME);
		await driver.get(LOCALSERVER + "/basic_auth");
		await driver.switchTo().alert().then((alert) => alert.dismiss());

		await wait(SLEEP_TIME);
		// for some odd reason using page source causes a crash here
		source = await driver.executeScript(`
			return document.documentElement.innerHTML;
		`);

		expect(source.includes("Unauthorized")).to.be.true;
	});

	it('should test whitelist option - disable referer', async () => {
		await driver.get(LOCALSERVER + "/whitelist_test");
		await driver.findElement(By.id('link')).click();

		let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

		expect(response.referer).to.not.equal(undefined);

		// disable referer in whitelist
		await driver.get(EXTENSION_URI.replace('popup.html', 'whitelist.html'));

		await wait(SLEEP_TIME);

		await driver.executeScript(`
			document.querySelector('.card-header button').click();
			document.querySelectorAll('.card-body input')[1].click();
			document.querySelectorAll('.card-header button')[1].click();
		`);

		await wait(SLEEP_TIME);
		await driver.get(LOCALSERVER + "/whitelist_test");
		await driver.findElement(By.id('link')).click();

		response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

		expect(response.referer).to.equal(undefined);
	});

	it('should test whitelist option - disable websocket', async () => {
		// disable websocket in whitelist
		await driver.get(EXTENSION_URI.replace('popup.html', 'whitelist.html'));

		await wait(SLEEP_TIME);
		let tabs = await driver.getAllWindowHandles();
		await driver.switchTo().window(tabs[tabs.length - 1]);

		await driver.executeScript(`
			document.querySelector('.card-header button').click();
			document.querySelectorAll('.card-body input')[2].click();
			document.querySelectorAll('.card-header button')[1].click();
		`);

		await wait(SLEEP_TIME);
		await driver.get(LOCALSERVER + "/whitelist_test");
		hasWebsocket = await driver.executeScript(`
			return WebSocket ? true : false;
		`);

		expect(hasWebsocket).to.equal(false);
	});

	it('should test whitelist option - protect window name', async () => {
		await driver.get(LOCALSERVER + "/whitelist_test");

		await driver.executeScript(`
			document.querySelector('#link2').click();
		`);

		let tabs = await driver.getAllWindowHandles();
		await driver.switchTo().window(tabs[tabs.length - 1]);

		let winName = await driver.executeScript(`
			return window.name;
		`);
		await driver.close();

		tabs = await driver.getAllWindowHandles();
		await driver.switchTo().window(tabs[tabs.length - 1]);
		
		await driver.get(EXTENSION_URI.replace('popup.html', 'whitelist.html'));

		await wait(SLEEP_TIME );
		await driver.executeScript(`
			document.querySelector('.card-header button').click();
			document.querySelectorAll('.card-body input')[4].click();
			document.querySelectorAll('.card-header button')[1].click();
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
	
	it('should test whitelist option - spoof ip headers', async () => {
		await driver.get(EXTENSION_URI.replace('popup.html', 'whitelist.html'));

		await wait(SLEEP_TIME);
		await driver.executeScript(`
			document.querySelector('.card-header button').click();
			document.querySelectorAll('.card-body input')[3].click();
			document.querySelectorAll('.card-header button')[1].click();
		`);

		await wait(SLEEP_TIME);

		await driver.get(LOCALSERVER);
		let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

		expect(response.via).to.not.equal("");
		expect(response["x-forwarded-for"]).to.not.equal("");
	});

	it('should test whitelist option - spoof accept language', async () => {
		let spoofedLang = "lv,en-US;q=0.7,en;q=0.3";

		await selectOption('input[name="spoofAcceptLang"]');
		await driver.executeScript(`
			document.querySelector('select[name="spoofAcceptLangValue"]').value = "${spoofedLang}";
		`);

		await driver.get(EXTENSION_URI.replace('popup.html', 'whitelist.html'));
		await wait(SLEEP_TIME);

		await driver.executeScript(`
			document.querySelector('.card-header button').click();
			document.querySelectorAll('.card-body select')[0].value = "${spoofedLang}";
			document.querySelectorAll('.card-header button')[1].click();
		`);

		await wait(SLEEP_TIME);

		await driver.get(LOCALSERVER);
		let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText.toLowerCase())');

		expect(response["accept-language"]).to.equal(spoofedLang.toLowerCase());
	});

	it('should test whitelist option - timezone', async () => {
		let offset = new Date().getTimezoneOffset();

		await driver.executeScript(`
			var el = document.querySelector('select[name="timeZone"]');
			el.value = "Pacific/Kwajalein";
			el.dispatchEvent(new Event('change'));
		`);

		await driver.get(EXTENSION_URI.replace('popup.html', 'whitelist.html'));
		await wait(SLEEP_TIME);

		await driver.executeScript(`
			document.querySelector('.card-header button').click();
			document.querySelectorAll('.card-body input')[5].click();
			document.querySelectorAll('.card-header button')[1].click();
		`);

		await wait(SLEEP_TIME);

		await driver.get(LOCALSERVER + "/whitelist_test");
		let spoofedOffset = await driver.executeScript(`
			return document.querySelector('#offset').innerText;
		`);

		expect(spoofedOffset).to.not.equal(offset);
	});

	it('should test whitelist option - profile', async () => {
		await driver.get(LOCALSERVER);
		let response = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText)');

		await driver.get(EXTENSION_URI.replace('popup.html', 'whitelist.html'));

		await wait(SLEEP_TIME);

		await driver.executeScript(`
			document.querySelector('.card-header button').click();
			document.querySelectorAll('.card-body select')[1].value = "win11";
			document.querySelectorAll('.card-header button')[1].click();
		`);

		await wait(SLEEP_TIME);

		await driver.get(LOCALSERVER);
		let spoofed = await driver.executeScript('return JSON.parse(document.querySelector("pre").innerText)');

		expect(response["user-agent"]).to.not.equal(spoofed["user-agent"]);
	});
});