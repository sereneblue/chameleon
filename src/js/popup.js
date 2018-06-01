let selected = {
	header: "profile",
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
			document.getElementById('interval').value = data.interval;	
		}
	});
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
    chrome.storage.local.set({ useragents : uas });

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

    // build input list
    buildInputs();

    // update settings
    updateSettings();

    // capture events to update settings
	$('#interval').on('change', function(e) {
		chrome.storage.local.set({interval: e.target.value});
		chrome.runtime.sendMessage({duration: parseInt(e.target.value)}, function(){});
    });

	$('input[type="radio"][name="profile_type"]').on('change', function(e) {
		$.each($("li"), function(k, v) {
		  v.className = "";
		});

		$(`#sub_${getPlatform(e.target.value)}`).addClass("active");
	    chrome.storage.local.set({ useragent : e.target.value });

	    if (e.target.value.match(/.*?\d/)) {
	    	ua = uas[getPlatform(e.target.value)].find(u => u.value == e.target.value).ua;
		    chrome.storage.local.set({ useragentValue : ua });
	    }
		chrome.runtime.sendMessage({duration: parseInt($("#interval").val())}, function(){});
	});

	$('input[name="custom_ua"]').on('keyup', function(e) {
		if ($('input[type="radio"][name="profile_type"]:checked').val() == "custom") {
		    chrome.storage.local.set({ useragentValue : e.target.value });
		}
		chrome.runtime.sendMessage({duration: parseInt($("#interval").val())}, function(){});
	});
});