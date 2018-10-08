let selected = {
	header: "profile",
	option: "",
	platform: "",
	whitelist: ""
}

let whitelistRules = [];

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

		$(`#list_${platform}`).append(`<div class="useragent">${label.outerHTML}<input type="checkbox" name="exc_${ua.value}" style="float: right;"></input></div>`);
	  })
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
	let data = await get(null);
	data.timestamp = new Date().toLocaleString();
	var settings = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
	var exportElement = document.getElementById('export');
	exportElement.setAttribute("href", settings );
	exportElement.setAttribute("download", "chameleon_settings.json");
	exportElement.click();
};

// update ui display
// loop through input/select fields and get stored value
async function updateUI() {
	let data = await get(null);

	if (data.settings.useragent) {
		if (data.settings.useragent == "real") {
			$('#interval').hide();
			$(".item").addClass('disabled');
			$('input[type="radio"]:checked').addClass('disabled');
		} else if (data.settings.useragent.match(/.*?\d/)) {
			$(`#sub_${getPlatform(data.settings.useragent)}`).addClass("active");
			$('#interval').hide();
		} else if (data.settings.useragent == "custom") {
			$('input[name="custom_ua"]').val(data.settings.useragentValue);
			$('#interval').hide();
			$(`#sub_custom`).addClass("active");
		} else {
			$(`#sub_${getPlatform(data.settings.useragent)}`).addClass("active");
			$('#interval').show();
		}

		$('#profile input[name="profile_type"]').val([data.settings.useragent]);
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
		$(`input[name="${element.name}"]`).prop('checked', data.settings[element.name]);
	});

	// check if browser APIs avialable
	try {
		var cookieOption = browser.privacy.websites.cookieConfig.get({});
		cookieOption.then((c) => {
			$(`select[name="cookieConfig"]`).val(c.value.behavior);
		});
	} catch (e) {
		$(`select[name="cookieConfig"]`).parent().find("label").hide();
		$(`select[name="cookieConfig"]`).hide();
	}

	try {
		var trackingProtection = browser.privacy.websites.trackingProtectionMode.get({});
		trackingProtection.then((t) => {
			$(`input[name="enableTrackingProtection"]`).prop('checked', t.value == "always"? true: false);
		});
	} catch (e) {
		$(`input[name="enableTrackingProtection"]`).parent().find("label").hide();
		$(`input[name="enableTrackingProtection"]`).hide();
	}

	try {
		var firstPartyIsolate = browser.privacy.websites.firstPartyIsolate.get({});
		firstPartyIsolate.then((f) => {
			$(`input[name="firstPartyIsolate"]`).prop('checked', f.value);
		});
	} catch (e) {
		$(`input[name="firstPartyIsolate"]`).parent().find("label").hide();
		$(`input[name="firstPartyIsolate"]`).hide();
	}

	try {
		var resistFingerprinting = browser.privacy.websites.resistFingerprinting.get({});
		resistFingerprinting.then((r) => {
			$(`input[name="resistFingerprinting"]`).prop('checked', r.value);
		});
	} catch (e) {
		$(`input[name="resistFingerprinting"]`).parent().find("label").hide();
		$(`input[name="resistFingerprinting"]`).hide();
	}
	
	$(`select[name="screenSize"]`).val(data.settings.screenSize);

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
	$(`input[name="enableWhitelistRealProfile"]`).prop('checked', data.whitelist.enableRealProfile);

	$('#list_whitelistProfile input').each(function (i, element) {
		$(`input[name="${element.name}"]`).val(data.whitelist.profile[element.name.split('_')[1]]);
	});

	whitelistRules = data.whitelist.urlList;
	whitelistRules.forEach(function (i) {
		var element = `
		<div class="rule">
            <span style="width: 10%;" class="icon-bin ruleButton"></span>
            <span style="width: 5px; float: right;">&nbsp;</span>
            <span style="width: 10%;" class="icon-pencil ruleButton"></span>
            <div class="rulePattern">${i.url}</div>
        </div>`
        $('#rules').append(element);
	});
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
			$(`#sub_${menu[i]} span`).text(`+`);
			if (category == "whitelist") $('#ruleEdit').hide();
		} else {
			$(`#sub_${menu[i]} span`).text(`—`);
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
		return "windows";
	} else if (v.includes("mac")) {
		return "macos";
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

// save profile
function saveProfile() {
	var url = $('input[name="url"]')
	var urlValue = url.val().trim();
	var re = false;
	var pattern = "";

	if (urlValue == "") {
		url.addClass('invalid');
		return;
	} else {
		url.removeClass('invalid');
	}

	if ($('input[name="re"]').is(':checked')) {
		var patternElement = $('input[name="pattern"]');
		pattern = patternElement.val().trim();

		if (pattern == "") {
			patternElement.addClass('invalid');
			return;
		} else {
			patternElement.removeClass('invalid');
		}

		re = true;
	}

	var rule = {
		url: urlValue,
		re: re,
		pattern: pattern,
		options: {
			auth: $('input[name="authorization"]').is(':checked'),
			ip: $('input[name="ip"]').is(":checked"),
			ref: $('input[name="referer"]').is(":checked"),
			screen: $('input[name="screen"]').is(":checked"),
			websocket: $('input[name="websocket"]').is(":checked"),
			winName: $('input[name="winName"]').is(":checked")
		}
	};

	var idx = whitelistRules.findIndex(r => r.url == urlValue);
	if (idx > -1) {
		whitelistRules[idx] = rule;
	} else {
		whitelistRules.push(rule);
		var element = `
		<div class="rule">
	        <span class="icon-bin ruleButton" style="width: 10%;"></span>
	        <span style="width: 5px; float: right;">&nbsp;</span>
	        <span class="icon-pencil ruleButton" style="width: 10%;"></span>
	        <span>${urlValue}</span>
	    </div>`
	    $('#rules').append(element);
	}

	chrome.runtime.sendMessage({
		action: "whitelist",
		data: {
			key: "wl_urls",
			value: JSON.stringify(whitelistRules)
		}
	});

	$('#ruleEdit').hide();
}

// display whitelist rule editor
function showEditor(e) {
	$('input[name="pattern"]').val("");
	$('input[name="authorization"]').prop('checked', false);
	$('input[name="ip"]').prop('checked', false);
	$('input[name="referer"]').prop('checked', false);
	$('input[name="screen"]').prop('checked', false);
	$('input[name="websocket"]').prop('checked', false);
	$('input[name="winName"]').prop('checked', false);

	$("#ruleEdit").insertAfter($("#addRuleButton"));
	$('#ruleEdit').show();
}

document.addEventListener('DOMContentLoaded', function() {
	buildInputs();
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

	// export settings button
	$('button[name="export"]').on('click', function(e) {
		exportSettings();
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
		var el = $($(this).closest('.useragent').siblings().toArray()[0]);
		if (el.find('input[type="checkbox"]')[0].checked) this.checked = true;

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

	//capture whitelist update events
	$.each(whitelist, function(index, value) {
		$(`#sub_${value}`).on('click', function() {
			changeView(value, "whitelist");
		});
	});

	$('#wlEnable input[type="checkbox"]').on('click', function(e) {
		chrome.runtime.sendMessage({
			action: "whitelist",
			data: {
				key: e.target.name,
				value: this.checked
			}
		});
	});

	$('#list_whitelistProfile input').on('keyup', function(e) {
		chrome.runtime.sendMessage({
			action: "whitelist",
			data: {
				key: e.target.name,
				value: e.target.value
			}
		});
	});

	$(document).on('click', function(e) {
		if (e.target.id == 'addRuleButton'){
			$('input[name="url"]').val("");
			$('input[name="url"]').prop('disabled', false);
			$('input[name="pattern"]').prop('disabled', true);
			showEditor();
		} else if (e.target.id == 'saveProfile') {
			saveProfile();
		} else if (e.target.className.indexOf('ruleButton') > -1) {
			var pattern = $(e.target).parent().find('div').text();
			if (e.target.className.indexOf('pencil') > -1) {
				// set values for editor
				var txt = $(e.target).parent().find('div')[0].innerText;
				var idx = whitelistRules.findIndex(r => r.url == txt);

				var el = $('input[name="url"]');
				var el2 = $("#ruleEdit");

				el.val(whitelistRules[idx].url);
				el.prop('disabled', true);

				$('input[name="authorization"]').prop('checked', whitelistRules[idx].options.auth);
				$('input[name="ip"]').prop('checked', whitelistRules[idx].options.ip);
				$('input[name="referer"]').prop('checked', whitelistRules[idx].options.ref);
				$('input[name="screen"]').prop('checked', whitelistRules[idx].options.screen);
				$('input[name="websocket"]').prop('checked', whitelistRules[idx].options.websocket);
				$('input[name="winName"]').prop('checked', whitelistRules[idx].options.winName);

				$('input[name="pattern"]').val(whitelistRules[idx].pattern || "");
				$('input[name="re"]').prop('checked', whitelistRules[idx].re);
				$('input[name="pattern"]').prop('disabled', !whitelistRules[idx].re);

				el2.insertAfter($(e.target).parent());
				el2.show();
			} else {
				var element = $(e.target).parent();
				var el = $('#ruleEdit');

				if (el.is(":visible")) {
					if (element.find('div')[0].innerText == $('input[name="url"]').val()) {
						el.hide();
					}
				}

				// remove from whitelist
				whitelistRules.splice($('#rules .rule').index(element), 1);
				element.remove();

				chrome.runtime.sendMessage({
					action: "whitelist",
					data: {
						key: "wl_urls",
						value: JSON.stringify(whitelistRules)
					}
				});
			}
		} else if (e.target.name == 're') {
			$('input[name="pattern"]').prop('disabled', !e.target.checked);
		}
	});
});