let selected = {
	header: "profile",
	option: "",
	platform: "",
	whitelist: ""
}

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
		$(`input[name="${element.name}"]`).prop('checked', data.settings[element.name] ? true: false);
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
	$(`input[name="enableWhitelist"]`).prop('checked', data.whitelist.enabled);
	$(`input[name="enableWhitelistRealProfile"]`).prop('checked', data.whitelist.enableRealProfile);

	$('#list_whitelistProfile input').each(function (i, element) {
		$(`input[name="${element.name}"]`).val(data.whitelist.profile[element.name.split('_')[1]]);
	});

	$('textarea').val(JSON.stringify(data.whitelist.urlList));
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

// check if whitelist URLs valid input
function validated(input) {
	try {
		let urlList = JSON.parse(input);
		if (urlList.length > 0) {
			for (var i of urlList) {
				if (i.url == "" || i.url == undefined) {
					return false;
				}
			}
			return true;
		}
		return false; 
	} catch(e) {
		return false;
	}
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
		chrome.runtime.sendMessage({
			action: "interval",
			data: parseInt(e.target.value)
		});
	});

	// basically the same thing as above
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

	$('#profile .groups input[type="checkbox"]').on('click', function(e) {
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
				value: this.checked ? true : false 
			}
		});
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
				value: this.checked ? true : false
			}
		});
	});

	$('#options select').on('change', function(e) {
		chrome.runtime.sendMessage({
			action: "option",
			data: {
				key: e.target.name,
				value: e.target.value
			}
		});
	});

	//capture whitelist update events
	$.each(whitelist, function(index, value) {
		$(`#sub_${value}`).on('click', function() {
			changeView(value, "whitelist");
		});
	});

	$('#whitelist input[type="checkbox"]').on('click', function(e) {
		chrome.runtime.sendMessage({
			action: "whitelist",
			data: {
				key: e.target.name,
				value: this.checked ? true : false
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

	$('#whitelist textarea').on('keyup', function(e) {
		if (validated(e.target.value)) {
			chrome.runtime.sendMessage({
				action: "whitelist",
				data: {
					key: "wl_urls",
					value: e.target.value
				}
			});
			$('#list_whitelistRules textarea').css("border", "3px solid greenyellow");
		} else {
			$('#list_whitelistRules textarea').css("border", "3px solid red");
		}
	});
});