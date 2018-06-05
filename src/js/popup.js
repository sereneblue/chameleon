let selected = {
	header: "profile",
	option: "",
	os: ""
}

function buildInputs() {
	$.each(platforms, function(index, platform) {
	  $.each(uas[platform], function(i, ua) {
		// create html elements
        var input = document.createElement("input");
        input.name = "profile_type";
        input.type = "radio";
        input.value = ua.value;

        var label = document.createElement("label");
        label.innerHTML = ` ${ua.name}`;

        $(`#list_${platform}`).append(`<div class="useragent">${input.outerHTML + label.outerHTML}</div>`);
	  })
	});
}

function updateSettings() {
	chrome.storage.local.get('useragent', function(data) {
	    $('input[name="profile_type"]').val([data.useragent]);
		$(`#sub_${getPlatform(data.useragent)}`).addClass("active");

		if (data.useragent == "custom") {
			chrome.storage.local.get('useragentValue', function(d) {
				$('input[name="custom_ua"]').val(d.useragentValue);
			});
		}
	});

	chrome.storage.local.get('interval', function(data) {
		if (data.interval) {
			$('#interval').val(data.interval);	
		}
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
}

function changeOptionList(opt) {
	if (opt != selected.opt) {
		$(`#list_${selected.opt}`).hide();
		selected.opt = opt;
	}

	$(`#list_${opt}`).toggle();

	for (var i in options) {
		var vis = $(`#list_${options[i]}`).is(':visible');
		if (!vis) {
			$(`#sub_${options[i]} span`).text(`+`);
		} else {
			$(`#sub_${options[i]} span`).text(`—`);
		}
	}
}

function changeUserAgentList(os) {
	if (os != selected.os) {
		$(`#list_${selected.os}`).hide();
		selected.os = os;
	}

	$(`#list_${os}`).toggle();

	for (var i in platforms) {
		var vis = $(`#list_${platforms[i]}`).is(':visible');
		if (!vis) {
			$(`#sub_${platforms[i]} span`).text(`+`);
		} else {
			$(`#sub_${platforms[i]} span`).text(`—`);
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

document.addEventListener('DOMContentLoaded', function() {
	chrome.runtime.sendMessage({useragents: uas });

    // build input list
    buildInputs();

    // update settings
    updateSettings();

    // capture events to profile settings
    $.each(menu, function (index, value) {
    	$(`#menu_${value}`).on('click', function() {
	        changeTab(value);
	    });
    })

    $.each(platforms, function(index, value) {
	    $(`#sub_${value}`).on('click', function() {
	        changeUserAgentList(value);
	    });
    })

	$('#interval').on('change', function(e) {
		chrome.runtime.sendMessage({duration: parseInt(e.target.value)});
    });

	$('input[type="radio"][name="profile_type"]').on('change', function(e) {
		$.each($("li"), function(k, v) {
		  v.className = "";
		});

		$(`#sub_${getPlatform(e.target.value)}`).addClass("active");
		chrome.runtime.sendMessage({useragent: e.target.value});

	    if (e.target.value.match(/.*?\d/)) {
	    	ua = uas[getPlatform(e.target.value)].find(u => u.value == e.target.value).ua;
    		chrome.runtime.sendMessage({useragentValue: ua});
	    }
		chrome.runtime.sendMessage({duration: parseInt($("#interval").val())});
	});

	$('input[name="custom_ua"]').on('keyup', function(e) {
		if ($('input[type="radio"][name="profile_type"]:checked').val() == "custom") {
    		chrome.runtime.sendMessage({useragentValue: e.target.value});
		}
		chrome.runtime.sendMessage({duration: parseInt($("#interval").val())});
	});

	// capture headers update events
	$('#headers input[type="checkbox"]').on('click', function(e) {
		chrome.runtime.sendMessage({ headers: { field: e.target.name, value: this.checked ? true : false }});
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
				chrome.runtime.sendMessage({ headers: { field: input, value: "" }});
			}
		}

		chrome.runtime.sendMessage({ headers: { field: e.target.name, value: e.target.value }});
	});

	$('#headers input').on('keyup', function(e) {
		// validate ip
		if (e.target.value.match(/^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/)) {
			chrome.runtime.sendMessage({ headers: { field: e.target.name, value: e.target.value }});
		    $(this).css("border", "3px solid darkseagreen");
		} else {
		    $(this).css("border", "3px solid firebrick");
		}
	});

	//capture options update events
	$.each(options, function(index, value) {
	    $(`#sub_${value}`).on('click', function() {
	        changeOptionList(value);
	    });
	});

	$('#options input[type="checkbox"]').on('click', function(e) {
		chrome.runtime.sendMessage({ option: { field: e.target.name, value: this.checked ? true : false }});
	});

	$('#options select').on('change', function(e) {
		chrome.runtime.sendMessage({ option: { field: e.target.name, value: e.target.value }});
	});
});