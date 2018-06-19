let selected = {
	header: "profile",
	option: "",
	platform: "",
	whitelist: ""
}

// when popup opened, populate the useragent list from data.js 
function buildInputs() {
	$.each(platforms, function(index, platform) {
	  $.each(uas[platform], function(i, ua) {
		// create html elements
		var input = document.createElement("input");
		input.name = "profile_type";
		input.type = "radio";
		input.value = ua.value;

		var label = document.createElement("label");
		label.innerText = ` ${ua.name}`;

		$(`#list_${platform}`).append(`<div class="useragent">${input.outerHTML + label.outerHTML}</div>`);
	  })
	});
}

// update ui display
// loop through input/select fields and get stored value
function updateUI() {
	chrome.storage.local.get('useragent', function(data) {
		$('input[name="profile_type"]').val([data.useragent]);

		if (data.useragent) {
			if (data.useragent == "real") {
				$('#interval').hide();
				$(".item").addClass('disabled');
				$('input[type="radio"]:checked').addClass('disabled');
			} else if (data.useragent.match(/.*?\d/)) {
				$(`#sub_${getPlatform(data.useragent)}`).addClass("active");
				$('#interval').hide();
			} else if (data.useragent == "custom") {
				chrome.storage.local.get('useragentValue', function(d) {
					$('input[name="custom_ua"]').val(d.useragentValue);
				});
				$('#interval').hide();
				$(`#sub_custom`).addClass("active");
			} else {
				$(`#sub_${getPlatform(data.useragent)}`).addClass("active");
				$('#interval').show();
			}
		}
	});

	chrome.storage.local.get('interval', function(data) {
		if (data.interval) {
			$('select[name="interval"]').val(data.interval);	
		}
	});

	chrome.storage.local.get('notificationsEnabled', function(data) {
		$(`input[name="notificationsEnabled"]`).prop('checked', data.notificationsEnabled);
	});

	$('#headers input[type="checkbox"]').each(function(i, element) {
		chrome.storage.local.get(element.name, function(data) {
			$(`input[name="${element.name}"]`).prop('checked', data[element.name]);
		});
	});

	$('.opt select').each(function (i, element) {
		chrome.storage.local.get(element.name, function(data) {
			var value = data[element.name] ? data[element.name] : 0;
			$(`select[name="${element.name}"]`).val(value);

			if (element.name == "spoofViaValue" || element.name == "spoofXForValue") {
				var ipDiv = $(`select[name="${element.name}"]`).siblings(".ipAddr");
				(value == 1) ? ipDiv.show() : ipDiv.hide();

				var setting = element.name == "spoofViaValue" ? "viaIP" : "xforwardedforIP";
				chrome.storage.local.get(setting, function(d) {
					$(`input[name="${setting}"]`).val(d[setting]);
				});
			}
		});
	});

	$('#list_scriptInjection input').each(function (i, element) {
		chrome.storage.local.get(element.name, function(data) {
			$(`input[name="${element.name}"]`).prop('checked', data[element.name] ? true: false);
		});
	});

	var cookieOption = browser.privacy.websites.cookieConfig.get({});
	cookieOption.then((c) => {
		$(`select[name="cookieConfig"]`).val(c.value.behavior);
	});

	var trackingProtection = browser.privacy.websites.trackingProtectionMode.get({});
	trackingProtection.then((t) => {
		$(`input[name="enableTrackingProtection"]`).prop('checked', t.value == "always"? true: false);
	});

	var firstPartyIsolate = browser.privacy.websites.firstPartyIsolate.get({});
	firstPartyIsolate.then((f) => {
		$(`input[name="firstPartyIsolate"]`).prop('checked', f.value);
	});

	var resistFingerprinting = browser.privacy.websites.resistFingerprinting.get({});
	resistFingerprinting.then((r) => {
		$(`input[name="resistFingerprinting"]`).prop('checked', r.value);
	});	

	chrome.storage.local.get("screenSize", function(data) {
		var value = data.screenSize ? data.screenSize : "default";
		$(`select[name="screenSize"]`).val(value);
	});

	chrome.storage.local.get("enableWhitelist", function(data) {
		$(`input[name="enableWhitelist"]`).prop('checked', data.enableWhitelist);;
	});

	$('#list_whitelistProfile input').each(function (i, element) {
		chrome.storage.local.get(element.name, function(data) {
			if (data[element.name]) {
				$(`input[name="${element.name}"]`).val(data[element.name]);
			}
		});
	});

	chrome.storage.local.get("wl_urls", function(data) {
		$('textarea').val(data.wl_urls);;
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
		return "macOS";
	} else if (v.includes("linux")) {
		return "linux";
	} else if (v.includes("iOS")) {
		return "iOS";
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
	chrome.runtime.sendMessage({
		action: "storage",
		data: {
			key: "useragents",
			value: uas
		}
	});

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
				ua = uas[getPlatform(e.target.value)].find(u => u.value == e.target.value).ua;
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
					key: e.target.name,
					value: e.target.value
				}
			});
			$('#list_whitelistRules textarea').css("border", "3px solid greenyellow");
		} else {
			$('#list_whitelistRules textarea').css("border", "3px solid red");
		}
	});
});