let selected = {
	header: "profile",
	option: "",
	platform: "",
	whitelist: ""
}

let data = null;

// when popup opened, populate the useragent list from data.js 
function buildInputs() {
	$.each(platforms, function(index, platform) {
	  $.each(uaList[platform], function(i, ua) {
		// create html elements
		var input = document.createElement("input");
		input.name = "profile_type";
		input.type = "radio";
		input.value = ua.value;

		var label = document.createElement("label");
		label.innerHTML = `${input.outerHTML + " " + ua.name}`;

		$(`#list_${platform}`).append(`<div class="useragent ${i % 2 ? '' : 'alt' }">${label.outerHTML}<input type="checkbox" name="exc_${ua.value}" style="float: right;"></input></div>`);
	  })
	});

	let select = $('select[name="timeZone"]');
	$.each(chameleonTimezones, function(index, tz) {
		select.append($('<option>', {value: tz.zone, text: `(${tz.offset ? tz.offset : "GMT"}) ${tz.zone}`}));
	});
}

function get(key) {
	return new Promise((resolve) => {
		chrome.storage.local.get(key, (item) => {
			typeof key == "string" ? resolve(item[key]) : resolve(item);
		});
	});
}

// export settings
async function exportSettings() {
	data = await get(null);
	var settings = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
	var exportElement = document.getElementById('export');
	exportElement.setAttribute("href", settings );
	exportElement.setAttribute("download", `chameleon_${new Date().getTime()}.json`);
	exportElement.click();
};

// set localized text
function localize() {
	// about tab
	$("#contrib").html(browser.i18n.getMessage("aboutContributors"));
	$("#license").text(browser.i18n.getMessage("aboutLicense"));
	$("#sourceCode").text(browser.i18n.getMessage("aboutSrcCode"));
	$("#reportBug").text(browser.i18n.getMessage("aboutReport"));
	$("#translate").text(browser.i18n.getMessage("aboutTranslate"));
	$("#wiki").text(browser.i18n.getMessage("aboutWiki"));
	$("#settingsHeader").text(browser.i18n.getMessage("textSettings"));
	$("#importSettings").text(browser.i18n.getMessage("aboutBtnImport"));
	$("#exportSettings").text(browser.i18n.getMessage("aboutBtnExport"));

	// tab headers
	$("#menu_profile").text(browser.i18n.getMessage("tabProfile"));
	$("#menu_headers").text(browser.i18n.getMessage("tabHeaders"));
	$("#menu_options").text(browser.i18n.getMessage("tabOptions"));
	$("#menu_whitelist").text(browser.i18n.getMessage("textWhitelist"));

	// profiles tab
	$("#notifications").text(browser.i18n.getMessage("profileEnableNotification"));
	$("#profileRandom").text(browser.i18n.getMessage("profileRandom"));
	$("#profileRandomDesktop").text(browser.i18n.getMessage("profileRandomDesktop"));
	$("#profileRandomMobile").text(browser.i18n.getMessage("profileRandomMobile"));
	$("#profileScriptInjectionMsg").text(browser.i18n.getMessage("profileScriptInjectionMsg"));
	$("#profilePeriodically").text(browser.i18n.getMessage("profilePeriodically"));
	$("select[name='interval'] option:eq(0)").text(browser.i18n.getMessage("profileIntervalNo"));
	$("select[name='interval'] option:eq(1)").text(browser.i18n.getMessage("profileIntervalCustom"));
	$("select[name='interval'] option:eq(2)").text(browser.i18n.getMessage("profileIntervalMinute"));
	$("select[name='interval'] option:eq(3)").text(browser.i18n.getMessage("profileIntervalMinute5"));
	$("select[name='interval'] option:eq(4)").text(browser.i18n.getMessage("profileIntervalMinute10"));
	$("select[name='interval'] option:eq(5)").text(browser.i18n.getMessage("profileIntervalMinute20"));
	$("select[name='interval'] option:eq(6)").text(browser.i18n.getMessage("profileIntervalMinute30"));
	$("select[name='interval'] option:eq(7)").text(browser.i18n.getMessage("profileIntervalMinute40"));
	$("select[name='interval'] option:eq(8)").text(browser.i18n.getMessage("profileIntervalMinute50"));
	$("select[name='interval'] option:eq(9)").text(browser.i18n.getMessage("profileIntervalHour"));
	$("#profileIntervalRefresh").text(browser.i18n.getMessage("profileIntervalRefresh"));
	$("label[for='minInterval']").text(browser.i18n.getMessage("profileIntervalCustomMin"));
	$("label[for='maxInterval']").text(browser.i18n.getMessage("profileIntervalCustomMax"));
	$(".profileBrowser").text(browser.i18n.getMessage("profileBrowser"));
	$(".profileCustom").text(browser.i18n.getMessage("profileCustom"));
	$(".profileExclude").text(browser.i18n.getMessage("profileExclude"));
	$("#profileRandomWindows").text(browser.i18n.getMessage("profileRandomWindows"));
	$("#profileRandomMacOS").text(browser.i18n.getMessage("profileRandomMacOS"));
	$("#profileRandomLinux").text(browser.i18n.getMessage("profileRandomLinux"));
	$("#profileRandomIOS").text(browser.i18n.getMessage("profileRandomIOS"));
	$("#profileRandomAndroid").text(browser.i18n.getMessage("profileRandomAndroid"));

	// headers tab
	$("#headersDisableAuth").text(browser.i18n.getMessage("headersDisableAuth"));
	$("#headersEnableDNT").text(browser.i18n.getMessage("headersEnableDNT"));
	$("#headersBlockEtag").text(browser.i18n.getMessage("headersBlockEtag"));
	$("#headersSpoofVia").text(browser.i18n.getMessage("headersSpoofVia"));
	$("#headersSpoofXForwarded").text(browser.i18n.getMessage("headersSpoofXForwarded"));
	$("#headersIP").text(browser.i18n.getMessage("headersIP"));
	$("select[name='spoofViaValue'] option:eq(0)").text(browser.i18n.getMessage("headersIPRandom"));
	$("select[name='spoofViaValue'] option:eq(1)").text(browser.i18n.getMessage("headersIPCustom"));
	$("select[name='spoofXForValue'] option:eq(0)").text(browser.i18n.getMessage("headersIPRandom"));
	$("select[name='spoofXForValue'] option:eq(1)").text(browser.i18n.getMessage("headersIPCustom"));
	$(".headersIP").text(browser.i18n.getMessage("headersIP"));
	$(".headersIP").text(browser.i18n.getMessage("headersIP"));
	$("#headersDisableRef").text(browser.i18n.getMessage("headersDisableRef"));
	$("#headersSpoofSourceRef").text(browser.i18n.getMessage("headersSpoofSourceRef"));
	$("#headersUpgradeInsecureReq").text(browser.i18n.getMessage("headersUpgradeInsecureReq"));
	$("#headersMsg1").text(browser.i18n.getMessage("headersMsg1"));
	$("#headersMsg2").text(browser.i18n.getMessage("headersMsg2"));
	$("#headersRefererXorigin").text(browser.i18n.getMessage("headersRefererXorigin"));
	$("select[name='refererXorigin'] option:eq(0)").text(browser.i18n.getMessage("headersRefererXoriginOption1"));
	$("select[name='refererXorigin'] option:eq(1)").text(browser.i18n.getMessage("headersRefererXoriginOption2"));
	$("select[name='refererXorigin'] option:eq(2)").text(browser.i18n.getMessage("headersRefererXoriginOption3"));
	$("#headersRefererTrimming").text(browser.i18n.getMessage("headersRefererTrimming"));
	$("select[name='refererTrimming'] option:eq(0)").text(browser.i18n.getMessage("headersRefererTrimmingOption1"));
	$("select[name='refererTrimming'] option:eq(1)").text(browser.i18n.getMessage("headersRefererTrimmingOption2"));
	$("select[name='refererTrimming'] option:eq(2)").text(browser.i18n.getMessage("headersRefererTrimmingOption3"));
	$("#headersSpoofAccept").text(browser.i18n.getMessage("headersSpoofAccept"));
	$("#headersSpoofAcceptLang").text(browser.i18n.getMessage("headersSpoofAcceptLang"));

	// options tab
	$("#optionsGroupScriptInjection").text(browser.i18n.getMessage("optionsGroupScriptInjection"));
	$("#optionsEnableScriptInjection").text(browser.i18n.getMessage("optionsEnableScriptInjection"));
	$("#optionsEnableScriptInjectionMsg").text(browser.i18n.getMessage("optionsEnableScriptInjectionMsg"));
	$("select[name='webSockets'] option:eq(0)").text(browser.i18n.getMessage("optionsWebsocketsOption1"));
	$("select[name='webSockets'] option:eq(1)").text(browser.i18n.getMessage("optionsWebsocketsOption2"));
	$("select[name='webSockets'] option:eq(2)").text(browser.i18n.getMessage("optionsWebsocketsOption3"));
	$("#optionsLimitHistory").text(browser.i18n.getMessage("optionsLimitHistory"));
	$("#optionsProtectWinName").text(browser.i18n.getMessage("optionsProtectWinName"));
	$("#optionsProtectKBFingerprint").text(browser.i18n.getMessage("optionsProtectKBFingerprint"));
	$("input[name='kbDelay']").attr('placeholder', browser.i18n.getMessage("optionsKBDelay"));
	$("#optionsSpoofAudioContext").text(browser.i18n.getMessage("optionsSpoofAudioContext"));
	$("#optionsSpoofClientRects").text(browser.i18n.getMessage("optionsSpoofClientRects"));
	$("#optionsSpoofScreenSize").text(browser.i18n.getMessage("optionsSpoofScreenSize"));
	$("select[name='screenSize'] option:eq(2)").text(browser.i18n.getMessage("optionsSpoofScreenSizeOptionProfile"));
	$("#optionsSpoofScreenSizeCustomWidth").text(browser.i18n.getMessage("optionsSpoofScreenSizeCustomWidth"));
	$("#optionsSpoofScreenSizeCustomHeight").text(browser.i18n.getMessage("optionsSpoofScreenSizeCustomHeight"));
	$("#optionsSpoofTimezone").text(browser.i18n.getMessage("optionsSpoofTimezone"));
	$("#optionsGroupStandard").text(browser.i18n.getMessage("optionsGroupStandard"));
	$("#optionsFirstPartyIsolate").text(browser.i18n.getMessage("optionsFirstPartyIsolate"));
	$("#optionsResistFingerprinting").text(browser.i18n.getMessage("optionsResistFingerprinting"));
	$("#optionsTrackingProtection").text(browser.i18n.getMessage("optionsTrackingProtection"));
	$("select[name='trackingProtectionMode'] option:eq(0)").text(browser.i18n.getMessage("optionsTrackingProtectionOption1"));
	$("select[name='trackingProtectionMode'] option:eq(1)").text(browser.i18n.getMessage("optionsTrackingProtectionOption2"));
	$("select[name='trackingProtectionMode'] option:eq(2)").text(browser.i18n.getMessage("optionsTrackingProtectionOption3"));
	$("#optionsWebRTC").text(browser.i18n.getMessage("optionsWebRTC"));
	$("select[name='webRTCIPHandlingPolicy'] option:eq(1)").text(browser.i18n.getMessage("optionsWebRTCOption2"));
	$("select[name='webRTCIPHandlingPolicy'] option:eq(2)").text(browser.i18n.getMessage("optionsWebRTCOption3"));
	$("select[name='webRTCIPHandlingPolicy'] option:eq(3)").text(browser.i18n.getMessage("optionsWebRTCOption4"));
	$("#optionsGroupCookie").text(browser.i18n.getMessage("optionsGroupCookie"));
	$("#optionsCookiePolicy").text(browser.i18n.getMessage("optionsCookiePolicy"));
	$("select[name='cookieConfig'] option:eq(0)").text(browser.i18n.getMessage("optionsCookiePolicyOption1"));
	$("select[name='cookieConfig'] option:eq(1)").text(browser.i18n.getMessage("optionsCookiePolicyOption2"));
	$("select[name='cookieConfig'] option:eq(2)").text(browser.i18n.getMessage("optionsCookiePolicyOption3"));
	$("select[name='cookieConfig'] option:eq(3)").text(browser.i18n.getMessage("optionsCookiePolicyOption4"));
	$("select[name='cookieConfig'] option:eq(4)").text(browser.i18n.getMessage("optionsCookiePolicyOption5"));
	$("#openChecklist").text(browser.i18n.getMessage("optionsOpenChecklist"));
	
	// whitelist tab
	$("#whitelistEnable").text(browser.i18n.getMessage("whitelistEnable"));
	$("#whitelistEnableContextMenu").text(browser.i18n.getMessage("whitelistEnableContextMenu"));
	$("#whitelistUseDefault").text(browser.i18n.getMessage("whitelistUseDefault"));
	$("#whitelistViewIPRules").text(browser.i18n.getMessage("whitelistViewIPRules"));
	$("#whitelistViewRules").text(browser.i18n.getMessage("whitelistViewRules"));
	$("#whitelistCurrentDomain").text(browser.i18n.getMessage("whitelistCurrentDomain"));
	$("#whitelistOpenEditor").text(browser.i18n.getMessage("whitelistOpenEditor"));

	// text
	$(".textReset").text(browser.i18n.getMessage("textReset"));
	$("select[name='screenSize'] option:eq(1)").text(browser.i18n.getMessage("textCustom"));
	$("select[name='screenSize'] option:eq(0)").text(browser.i18n.getMessage("textDefault"));
	$("select[name='timeZone'] option:eq(0)").text(browser.i18n.getMessage("textDefault"));
	$("select[name='webRTCIPHandlingPolicy'] option:eq(0)").text(browser.i18n.getMessage("textDefault"));
	$("#profileReal").text(browser.i18n.getMessage("textRealProfile"));
	$("select[name='defaultProfile'] option:eq(0)").text(browser.i18n.getMessage("textRealProfile"));
}

// update ui display
// loop through input/select fields and get stored value
async function updateUI() {
	data = await get(null);

	if (data.settings.useragent) {
		if (data.settings.useragent == "real") {
			$('input[name="profile_type"]').val(["real"]);
			$('#interval').hide();
			$(".item").addClass('disabled');
			$('input[type="radio"]:checked').addClass('disabled');
		} else if (data.settings.useragent.match(/.*?\d/)) {
			$(`#sub_${getPlatform(data.settings.useragent)}`).addClass("active");
			$('#profile input[name="profile_type"]').val([data.settings.useragent]);
			$('#interval').hide();
		} else if (data.settings.useragent == "custom") {
			$('input[name="custom_ua"]').val(data.settings.useragentValue);
			$('#interval').hide();
			$(`#sub_custom`).addClass("active");
		} else {
			$('#profile input[name="profile_type"]').val([data.settings.useragent]);
			$('#interval').show();
		}
	}

	if (data.settings.interval) {
		$('#profile select[name="interval"]').val(data.settings.interval);

		if (data.settings.interval == "-1") {
			$('#range').show();
			$('#range input[name="minInterval').val(data.settings.minInterval);
			$('#range input[name="maxInterval').val(data.settings.maxInterval);
		}
	}

	if (data.excluded) {
		for (var os in data.excluded) {
			for (var i in data.excluded[os]) {
				var idx = parseInt(i);
				$(`#profile .groups input[name="exc_${os}${idx+1}"]`).prop('checked', data.excluded[os][idx]);
			}
		}
	}
	
	$(`#profile input[name="notificationsEnabled"]`).prop('checked', data.settings.notificationsEnabled);


	acceptLangSelect = $('select[name="spoofAcceptLangValue"]')
	languages.forEach(function (l) {
		acceptLangSelect.append($('<option>', {
		    value: l.value,
		    text: l.display
		}));
	});
	
	$('#headers input[type="checkbox"]').each(function(i, element) {
		if (element.name == "spoofAcceptLang" || element.name == "spoofAcceptEnc") {
			$(`input[name="${element.name}"]`).prop('checked', data.headers[element.name]);
		} else {
			$(`#headers input[name="${element.name}"]`).prop('checked', data.headers[element.name]);
			if (element.name == "disableRef") {
				if (data.headers[element.name]) {
					$('input[name="spoofSourceRef"]').prop('disabled', true);
					$('select[name="refererXorigin"]').prop('disabled', true);
					$('select[name="refererTrimming"]').prop('disabled', true);
				}
			}
		}
	});

	$('.opt select').each(function (i, element) {
		if (data.headers[element.name] != undefined) {
			$(`select[name="${element.name}"]`).val(data.headers[element.name]);

			if (element.name == "spoofViaValue" || element.name == "spoofXForValue") {
				var ipDiv = $(`select[name="${element.name}"]`).siblings(".ipAddr");
				(data.headers[element.name] == 1) ? ipDiv.show() : ipDiv.hide();

				var setting = element.name == "spoofViaValue" ? "viaIP" : "xforwardedforIP";
				$(`input[name="${setting}"]`).val(data.headers[setting]);
			}
		}
	});

	$('#list_scriptInjection input').each(function (i, element) {
		if (element.name == "protectKeyboardFingerprint") {
			$('input[name="kbDelay"]').prop('disabled', !data.settings[element.name]);
		}

		$(`input[name="${element.name}"]`).prop('checked', data.settings[element.name]);
	});

	if (data.settings.kbDelay) $('input[name="kbDelay"]').val(data.settings.kbDelay);

	browser.privacy.websites.cookieConfig.get({}).then((c) => {
		$(`select[name="cookieConfig"]`).val(c.value.behavior);
	});

	browser.privacy.websites.trackingProtectionMode.get({}).then((t) => {
		$(`select[name="trackingProtectionMode"]`).val(t.value);
	});

	browser.privacy.websites.firstPartyIsolate.get({}).then((f) => {
		$(`input[name="firstPartyIsolate"]`).prop('checked', f.value);
	});

	browser.privacy.websites.resistFingerprinting.get({}).then((r) => {
		$(`input[name="resistFingerprinting"]`).prop('checked', r.value);
	});

	browser.privacy.network.webRTCIPHandlingPolicy.get({}).then((w) => {
		$(`select[name="webRTCIPHandlingPolicy"]`).val(w.value);
	});
	
	$(`select[name="screenSize"]`).val(data.settings.screenSize);
	$(`select[name="webSockets"]`).val(data.settings.webSockets);

	if (data.settings.screenSize == "custom") {
		$('#customScreen').show();
		if (data.settings.customScreen) {
			let res = data.settings.customScreen.split('x');
			let width = res[0], height = res[1];
			$('#customWidth').val(width);
			$('#customHeight').val(height);
		}
	}

	$(`select[name="timeZone"]`).val(data.settings.timeZone);
	$(`input[name="enableWhitelist"]`).prop('checked', data.whitelist.enabled);
	$(`input[name="enableContextMenu"]`).prop('checked', data.whitelist.enabledContextMenu);

	// add list of profiles to default whitelist profile dropdown

	wlSelect = $('#whitelist select');
	profiles = Object.keys(uaList).map(os => uaList[os]).flat().sort((a, b) => a.name > b.name);

	$.each(profiles, (i) => {
		wlSelect.append($('<option>', {
		    value: profiles[i].value,
		    text: profiles[i].name
		}));
	});

	$('#whitelist select').val(data.whitelist.defaultProfile);

	let currentTab = await browser.tabs.query({ active: true, currentWindow: true});
	var l = document.createElement("a");
    l.href = currentTab[0].url;

    if (l.protocol != "about:" && 
    	l.protocol != "moz-extension:" &&
    	l.protocol != "ftp:" && 
    	l.protocol != "file:") {
		$('.whitelist h5').text(l.host);

		let idx = findRule(data.whitelist.urlList, currentTab[0].url);

		if (idx[0] >= 0) {
			let profile = profiles.find(p => p.value == data.whitelist.urlList[idx[0]].profile);

			if (profile) {
				profile = profile.name;
			} else if (data.whitelist.urlList[idx[0]].profile == "default") {
				profile = "Default Whitelist Profile";
			} else if (data.whitelist.urlList[idx[0]].profile == "real") {
				profile = "Real Profile";
			}

			$('.whitelist p').html(`
				<div>
					<strong>Status:</strong><br/>
					Whitelisted<br/>
				</div>
				<div>
					<strong>Profile:</strong><br/>
					${profile}
				</div>
				<input id="whitelistIndex" type="hidden" value="${idx[0]},${idx[1]}">
				${data.whitelist.urlList[idx[0]].domains[idx[1]].re ? 
				"<div><strong>Pattern:</strong></br>" + data.whitelist.urlList[idx[0]].domains[idx[1]].pattern + "</div>" : "" }`);
			return;
		}

		$('.whitelist p').text(`Status: Not whitelisted`);
		return;
    }

    $('.whitelist').hide();
}

// change view of displayed subitems
function changeView(val, category) {
	if (val != selected[category]) {
		$(`#list_${selected[category]}`).hide();
		selected[category] = val;
	}

	$(`#list_${val}`).toggle();

	var menu;
	if (category == "platform") {
		menu = platforms;
	} else if (category == "option") {
		menu = options;
	} else if (category == "whitelist") {
		menu = whitelist;
	}

	for (var i in menu) {
		var vis = $(`#list_${menu[i]}`).is(':visible');
		if (!vis) {
			$(`#sub_${menu[i]} span:eq(1)`).text(`+`);
		} else {
			$(`#sub_${menu[i]} span:eq(1)`).text(`—`);
		}
	}
}

function changeTab(tab) {
	if (selected.header != tab) {
		$(`#${selected.header}`).toggle();
		$(`#menu_${selected.header}`).toggleClass('active');
		$(`#${tab}`).toggle();
		$(`#menu_${tab}`).toggleClass('active');
		
		selected.header = tab;
	}
}

// determine platform from useragent option value
function getPlatform(v) {
	if (v.includes("win")) {
		return "win";
	} else if (v.includes("mac")) {
		return "mac";
	} else if (v.includes("linux")) {
		return "linux";
	} else if (v.includes("ios")) {
		return "ios";
	} else if (v.includes("android")) {
		return "android";
	} else if (v == "custom") {
		return "custom";	
	}
}

document.addEventListener('DOMContentLoaded', function() {
	buildInputs();
	localize();
	updateUI();

	// capture events to profile settings
	$.each(menu, function (index, value) {
		$(`#menu_${value}`).on('click', function() {
			changeTab(value);
		});
	})

	$.each(platforms, function(index, value) {
		$(`#sub_${value}`).on('click', function() {
			changeView(value, "platform");
		});
	})

	$('select[name="interval"]').on('change', function(e) {
		if (e.target.value == "-1") {
			$('#range').show();

			$('#range input[name="minInterval"]').val("");
			$('#range input[name="maxInterval"]').val("");
		} else {
			$('#range').hide();
		}

		chrome.runtime.sendMessage({
			action: "interval",
			data: parseInt(e.target.value)
		});
	});

	$('#range input').on('change', function(e) {
		if (e.target.value) {
			var min = parseInt($('#range input[name="minInterval"]').val());
			var max = parseInt($('#range input[name="maxInterval"]').val());

			if ((min && max) && (min > 0) && (min < max)) {
				chrome.runtime.sendMessage({
					action: "intervals",
					data: [min, max]
				});
			}
		}
	})

	// change current profile
	$('button[name="changeNow"]').on('click', function(e) {
		chrome.runtime.sendMessage({
			action: "interval",
			data: parseInt($('select[name="interval"]').val())
		})
	})

	// import settings button
	$('#importSettings').on('click', function(e) {
		chrome.tabs.create({
		    url:  chrome.runtime.getURL('/import.html')
		});
		window.close();
	})

	// export settings button
	$('#exportSettings').on('click', function(e) {
		exportSettings();
	})

	// reset extension settings
	$('#resetSettings').on('click', function(e) {
		chrome.runtime.sendMessage({
			action: "reset"
		});
	})

	// notifications
	$('input[name="notificationsEnabled"]').on('change', function(e) {
		chrome.runtime.sendMessage({
			action: "storage",
			data: {
				key: "notificationsEnabled",
				value: $(this).is(':checked')
			}
		});
	});

	$('input[type="radio"][name="profile_type"]').on('change', function(e) {
		$.each($("li"), function(k, v) {
		  v.className = "";
		});

		chrome.runtime.sendMessage({
			action: "storage",
			data: {
				key: "useragent",
				value: e.target.value
			}
		});

		if (e.target.value == "real") {
			// change css classes to disabled
			$('#interval').hide();

			$(".item").addClass('disabled');
			$('input[type="radio"]:checked').addClass('disabled');
		} else {
			$(".item").removeClass('disabled');
			$('input[type="radio"]:checked').removeClass('disabled');

			if (e.target.value.match(/.*?\d/) || e.target.value == "custom") {
				$('#interval').hide();
				
				$(`#sub_${getPlatform(e.target.value)}`).addClass("active");
				ua = uaList[getPlatform(e.target.value)].find(u => u.value == e.target.value).ua;
				chrome.runtime.sendMessage({
					action: "storage",
					data: {
						key: "useragentValue",
						value: ua
					}
				});
			} else {
				$('#interval').show();

				if (e.target.value.match(/random_/)) {	
					$(`#sub_${getPlatform(e.target.value)}`).addClass("active");
				}
			}
		}

		chrome.runtime.sendMessage({
			action: "interval",
			data: parseInt($('select[name="interval"]').val())
		});
	});

	$('input[name="custom_ua"]').on('keyup', function(e) {
		if ($('input[type="radio"][name="profile_type"]:checked').val() == "custom") {
			chrome.runtime.sendMessage({
				action: "storage",
				data: {
					key: "useragentValue",
					value: e.target.value
				}
			});
		}
		chrome.runtime.sendMessage({
			action: "interval",
			data: parseInt($('select[name="interval"]').val())
		});
	});

	$('#profile div.useragent > input[type="checkbox"]').on('change', function(e) {
		chrome.runtime.sendMessage({
			action: "exclude",
			data: {
				key: e.target.name,
				value: this.checked
			}
		});
	});

	$(`#profile .excludeall input[type="checkbox"]`).on('click', function(e) {
		$(this).closest('.useragent').siblings().toArray().forEach(el => {
			$(el).find('input[type="checkbox"]').prop('checked', e.target.checked).trigger('change');
		});

		chrome.runtime.sendMessage({
			action: "exclude",
			data: {
				key: e.target.name,
				value: this.checked
			}
		});
	});

	// capture headers update events
	$('#headers input[type="checkbox"]').on('click', function(e) {
		chrome.runtime.sendMessage({ 
			action: "headers",
			data: {
				key: e.target.name,
				value: this.checked
			}
		});

		if (e.target.name == "disableRef") {
			$('input[name="spoofSourceRef"]').prop('disabled', this.checked);
			$('select[name="refererXorigin"]').prop('disabled', this.checked);
			$('select[name="refererTrimming"]').prop('disabled', this.checked);
		}
	});

	$('#headers select').on('change', function(e) {
		if (e.target.name == "spoofViaValue" || e.target.name == "spoofXForValue") {
			var element = $(`select[name="${e.target.name}"]`).siblings(".ipAddr");

			if (e.target.value == 1) {
				element.show()
			} else {
				element.find("input").val("");
				element.hide();

				var input = e.target.name == "spoofXForValue" ? "viaIP" : "xforwardedforIP";
				chrome.runtime.sendMessage({
					action: "headers",
					data: {
						key: input,
						value: ""
					}});
			}
		}

		chrome.runtime.sendMessage({
			action: "headers",
			data: {
				key: e.target.name,
				value: e.target.value
			}
		});
	});

	$('#headers input').on('keyup', function(e) {
		// validate ip
		if (e.target.value.match(/^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/)) {
			chrome.runtime.sendMessage({
				action: "headers",
				data: {
					key: e.target.name,
					value: e.target.value
				}
			});
			$(this).css("border", "3px solid darkseagreen");
		} else {
			$(this).css("border", "3px solid firebrick");
		}
	});

	//capture options update events
	$.each(options, function(index, value) {
		$(`#sub_${value}`).on('click', function() {
			changeView(value, "option");
		});
	});

	$('#options input[type="checkbox"]').on('click', function(e) {
		if (e.target.name == "protectKeyboardFingerprint") {
			$('input[name="kbDelay"]').prop('disabled', !this.checked);
		}

		chrome.runtime.sendMessage({
			action: "option",
			data: {
				key: e.target.name,
				value: this.checked
			}
		});
	});

	$('#list_standard button').on('click', function(e) {
		if (e.target.name == "resetTracking") {
			$('input[name="enableTrackingProtection"]').prop('checked', false);
		} if (e.target.name == "resetFirstParty") {
			$('input[name="firstPartyIsolate"]').prop('checked', false);
		} if (e.target.name == "resetFingerprinting") {
			$('input[name="resistFingerprinting"]').prop('checked', false);
		}

		chrome.runtime.sendMessage({
			action: "clear",
			data: e.target.name
		});
	})

	$('#options select').on('change', function(e) {
		if (e.target.name == "screenSize") {
			if (e.target.value == "custom") {
				$('#customWidth').val('');
				$('#customHeight').val('');
				$('#customScreen').show();
			} else {
				$('#customScreen').hide();
			}
		}

		chrome.runtime.sendMessage({
			action: "option",
			data: {
				key: e.target.name,
				value: e.target.value
			}
		});
	});

	// get kb delay value
	$('input[name="kbDelay"]').on('change input', function(e) {
		if (e.target.value >= 1 && e.target.value <= 1000) {
			chrome.runtime.sendMessage({
				action: "storage",
				data: {
					key: "kbDelay",
					value: e.target.value
				}
			});
		}
	})

	// get custom screen info
	$('#customScreen input').on('change', function(e) {
		if (e.target.value) {
			var width = parseInt($('#customWidth').val());
			var height = parseInt($('#customHeight').val());

			if (width && height) {
				chrome.runtime.sendMessage({
					action: "storage",
					data: {
						key: "customScreen",
						value: `${width}x${height}`
					}
				});
			}
		}
	})

	$('#wlEnable input[type="checkbox"]').on('click', function(e) {
		chrome.runtime.sendMessage({
			action: "whitelist",
			data: {
				key: e.target.name,
				value: this.checked
			}
		});
	});

	$('#whitelist select').on('change', function(e) {
		chrome.runtime.sendMessage({
			action: "whitelist",
			data: {
				key: e.target.name,
				value: e.target.value
			}
		});
	});

	$("#viewIPRules").on('click', function(e) {
		chrome.tabs.create({
		    url:  chrome.runtime.getURL('/ip.html')
		});
		window.close();
	})

	$("#viewRules").on('click', function(e) {
		chrome.tabs.create({
		    url:  chrome.runtime.getURL('/whitelist.html')
		});
		window.close();
	});

	$('#openChecklist').on('click', function(e) {
		chrome.tabs.create({
		    url:  chrome.runtime.getURL('/checklist.html')
		});

		window.close();
	});

	$('#openEditor').on('click', function(e) {
		let wlIdx = $('#whitelistIndex');
		let idx = wlIdx.length ? wlIdx.val().split(',').map(Number) : [-1, -1];

		if (idx[0] >= 0) {
			chrome.tabs.create({
				url: chrome.runtime.getURL(`/whitelist.html?url=${data.whitelist.urlList[idx[0]].domains[idx[1]].domain}&mode=edit`)
			});
		} else {
			chrome.tabs.create({
				url: chrome.runtime.getURL(`/whitelist.html?url=${$('.whitelist h5').text()}&mode=create`)
			});
		}

		window.close();
	});
});