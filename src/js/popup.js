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
	exportElement.setAttribute("download", `chameleon_settings_${new Date().getTime()}.json`);
	exportElement.click();
};

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
		$(`input[name="${element.name}"]`).prop('checked', data.settings[element.name]);
	});

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

		let idx = data.whitelist.urlList.findIndex(r => currentTab[0].url.indexOf(r.url) > -1);

		if (idx > -1) {
			let profile = profiles.find(p => p.value == data.whitelist.urlList[idx].profile);
			profile = profile ? profile.name : "Default Whitelist Profile";

			$('.whitelist p').html(`
				<div>
					<strong>Status:</strong><br/>
					Whitelisted<br/>
				</div>
				<div>
					<strong>Profile:</strong><br/>
					${profile}
				</div>
				${data.whitelist.urlList[idx].re ? 
				"<div><strong>Pattern:</strong></br>" + data.whitelist.urlList[idx].pattern + "</div>" : "" }`);
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
	$('button[name="import"]').on('click', function(e) {
		chrome.tabs.create({
		    url:  chrome.runtime.getURL('/import.html')
		});
		window.close();
	})

	// export settings button
	$('button[name="export"]').on('click', function(e) {
		exportSettings();
	})

	// reset extension settings
	$('button[name="reset"]').on('click', function(e) {
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

	$("#viewRules").on('click', function(e) {
		chrome.tabs.create({
		    url:  chrome.runtime.getURL('/whitelist.html')
		});
		window.close();
	});

	$('#openEditor').on('click', function(e) {
		var domain = $('.whitelist h5').text();

		chrome.tabs.create({
		    url:  chrome.runtime.getURL(`/whitelist.html?url=${domain}&mode=${$('.whitelist p').text() == "Status: Whitelisted" ? "edit" : "create"}`)
		});

		window.close();
	})
});