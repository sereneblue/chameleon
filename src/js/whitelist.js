let data = null;

let patternTemplate = (pattern, regexEnabled, disabled) => {
	return regexEnabled ? `<input class="form-input pattern" type="text" value="${pattern}" ${disabled ? "disabled" : ""}>` : "";
};

let languageTemplate = (lang) => {
	let template = `<div class="form-group"><label>Spoof Accept-Language</label><select class="form-select"><option value="" ${lang == "" || lang == undefined ? 'selected' : ""}>Default</option>`;

	for (var l of languages) {
		template += `<option value="${l.value}" ${l.value == lang ? "selected" : ""}>${l.display}</option>`
	}
	
	return template + `</select></div>`;
};

let whitelistTemplate = (profile) => {
	let template = `<div class="form-group"><label>Spoof Profile</label><select class="form-select"><option value="" ${profile == "" || profile == undefined ? 'selected' : ""}>Default Whitelist Profile</option>`;

	template += `<option value="real" ${profile == "real" ? 'selected' : ""}>Real Profile</option>`;

	for (var p of profiles) {
		template += `<option value="${p.value}" ${p.value == profile ? "selected" : ""}>${p.name}</option>`;
	}
	
	return template + `</select></div>`;
};


function get(key) {
	return new Promise((resolve) => {
		chrome.storage.local.get(key, (item) => {
			typeof key == "string" ? resolve(item[key]) : resolve(item);
		});
	});
}

function buildWhitelist(rules) {
	let ruleElement = document.getElementById('rules');
	ruleElement.innerHTML = "";

	for (var rule of rules) {
		ruleElement.insertAdjacentHTML('beforeend', `
		<div class="card text-left mt-2" id="${rule.url}">
		  <div class="card-header">
			<div class="card-title h5 d-block"><strong>${rule.url}</strong></div>
			<button class="btn btn-primary btn-sm d-inline-block mt-2">Edit</button>
			<button class="btn btn-success btn-sm d-inline-block d-hide mt-2">Save</button>
			<button class="btn btn-error btn-sm d-inline-block mt-2">Delete</button>
		  </div>
  		  <div class="divider"></div>
		  <div class="card-body d-hide">
		    <div class="container ">
		      <div class="columns">
		        <div class="column col-xs-6">
					<label class="form-switch">
						<input class="auth" type="checkbox" ${rule.options.auth ? "checked" : ""} disabled>
						<i class="form-icon"></i> Disable auth header
					</label>
					<label class="form-switch">
						<input class="ref" type="checkbox" ${rule.options.ref ? "checked" : ""} disabled>
						<i class="form-icon"></i> Disable Referer
					</label>
					<label class="form-switch">
						<input class="ws" type="checkbox" ${rule.options.websocket ? "checked" : ""} disabled>
						<i class="form-icon"></i> Disable WebSocket
					</label>
		        </div>
		        <div class="column col-xs-6">
		            <label class="form-switch">
		                <input class="ip" type="checkbox" ${rule.options.ip ? "checked" : ""} disabled>
		                <i class="form-icon"></i> Enable IP headers
		            </label>
		            <label class="form-switch">
		                <input class="name" type="checkbox" ${rule.options.winName ? "checked" : ""} disabled>
		                <i class="form-icon"></i> Enable Protect window name
		            </label>
		            <label class="form-switch">
		                <input class="tz" type="checkbox" ${rule.options.timezone ? "checked" : ""} disabled>
		                <i class="form-icon"></i> Enable Timezone Spoofing
		            </label>
		        </div>
		      </div>
		    </div>  
		    <label class="form-checkbox">
		        <input class="re" type="checkbox" ${rule.re ? "checked" : ""} disabled>
		        <i class="form-icon"></i> Regex enabled
		    </label>
		   ${patternTemplate(rule.pattern, rule.re, true)}
		    <label class="form-label">
		        <i class="form-icon"></i> Header IP (Via & X-Forwarded For) 
		        <input class="form-input spoof" type="text" value="${rule.spoofIP ? rule.spoofIP : ''}">
		    </label>
		   ${languageTemplate(rule.lang)}
		   ${whitelistTemplate(rule.profile)}
		  </div>
		</div>`)
	}
}

document.addEventListener('DOMContentLoaded', async function() {
	data = await get(null);
	let searchInput = $('#searchInput');
	searchInput.on('keyup', function(e) {
		let matches = data.whitelist.urlList.filter(r => r.url.includes(e.target.value.trim()));
		buildWhitelist(matches);
	});

	searchInput.val("");

	buildWhitelist(data.whitelist.urlList);

	$(document).click(function(e) {
		if (e.target.nodeName == "BUTTON") {
			if (e.target.innerText == "Delete") {
				if (!document.querySelector('.confirmation')) {
					$(e.target).parent()[0].insertAdjacentHTML('beforeend', `
						<div class="confirmation">
							<h5>Are you sure you want to delete this rule?</h5>
							<button class="btn btn-success btn-sm d-inline-block mt-2">Yes</button>
							<button class="btn btn-error btn-sm d-inline-block mt-2">No</button>
						</div>
					`);
				}
			} else if (e.target.innerText == "Edit") {
				if (document.querySelector('.confirmation')) {
					document.querySelector('.confirmation').remove();
				}

				var parent = $(e.target).parent().parent();
				var buttons = parent.find(':button');

				parent.find(":input").prop("disabled", false);
				parent.find('.card-body').toggleClass('d-hide');
				$(buttons[0]).toggleClass('d-hide');
				$(buttons[1]).toggleClass('d-hide');
			} else if (e.target.innerText == "Save") {
				var parent = $(e.target).parent().parent();
				var buttons = parent.find(':button');
				var lang = parent.find('select')[0].value
				var profile = parent.find('select')[1].value;

				// inputs
				let in_re = parent.find('.re')[0];
				let in_pattern = parent.find('.pattern')[0];
				let in_spoof = parent.find('.spoof')[0];
				let in_auth = parent.find('.auth')[0];
				let in_ip = parent.find('.ip')[0];
				let in_ref = parent.find('.ref')[0];
				let in_name = parent.find('.name')[0];
				let in_ws = parent.find('.ws')[0];
				let in_tz = parent.find('.tz')[0];

				if (in_re.checked && in_pattern.value == "") {
					in_pattern.classList.add('is-error');
					return;
				}

				if (in_pattern) {
					in_pattern.classList.remove('is-error');
				}

				if (in_spoof.value) {
					if (!/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(in_spoof.value)) {
						in_spoof.classList.add('is-error');
						return;
					}
				}

				in_spoof.classList.remove('is-error');

				let index = data.whitelist.urlList.findIndex(rule => rule.url == parent[0].id);
				data.whitelist.urlList[index] = {
					"url": parent[0].id,
					"re": in_re.checked,
					"pattern": in_pattern ? in_pattern.value : "",
					"lang": lang != "Default" ? lang : "",
					"profile": profile ? profile : "default",
					"spoofIP": in_spoof.value,
					"options": {
						"auth": in_auth.checked,
						"ip": in_ip.checked,
						"ref": in_ref.checked,
						"timezone": in_tz.checked,
						"websocket": in_ws.checked,
						"winName": in_name.checked
					}
				};

				chrome.runtime.sendMessage({
					action: "whitelist",
					data: {
						key: "wl_urls",
						value: JSON.stringify(data.whitelist.urlList)
					}
				});

				parent.find(":input[type='checkbox'], input[type='text']").prop("disabled", true);
				parent.find('.card-body').toggleClass('d-hide');
				buttons[0].classList.toggle('d-hide');
				buttons[1].classList.toggle('d-hide');
			} else if (e.target.innerText == "Yes") {
				var parent = $(e.target).parent().parent().parent()[0];
				let index = data.whitelist.urlList.findIndex(rule => rule.url == parent.id);
				data.whitelist.urlList.splice(index, 1);

				chrome.runtime.sendMessage({
					action: "whitelist",
					data: {
						key: "wl_urls",
						value: JSON.stringify(data.whitelist.urlList)
					}
				});

				parent.remove();
			} else if (e.target.innerText == "No") {
				$(e.target).parent()[0].remove();
			} else if (e.target.innerText == "Create") {
				var parent = $(e.target).parent().parent();
				var inputs = parent.find(':input');
				var index = data.whitelist.urlList.findIndex(rule => rule.url == inputs[0].value);
				var lang = parent.find('select')[0].value;
				var profile = parent.find('select')[1].value;

				// inputs
				let in_domain = parent.find('.domain')[0];
				let in_re = parent.find('.re')[0];
				let in_pattern = parent.find('.pattern')[0];
				let in_spoof = parent.find('.spoof')[0];
				let in_auth = parent.find('.auth')[0];
				let in_ip = parent.find('.ip')[0];
				let in_ref = parent.find('.ref')[0];
				let in_name = parent.find('.name')[0];
				let in_ws = parent.find('.ws')[0];
				let in_tz = parent.find('.tz')[0];

				if (in_domain.value == "" || index > -1 || !/^(?:^|\s)((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/.test(in_domain.value)) {
					in_domain.classList.add('is-error');
					return;
				}

				in_domain.classList.remove('is-error');

				if (in_re.checked && in_pattern.value == "") {
					in_pattern.classList.add('is-error');
					return;
				}

				if (in_pattern) {
					in_pattern.classList.remove('is-error');
				}

				if (in_spoof.value != "") {
					if (!/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(in_spoof.value)) {
						in_spoof.classList.add('is-error');
						return;
					}
				}

				in_spoof.classList.remove('is-error');

				data.whitelist.urlList.push({
					"url": in_domain.value,
					"re": in_re.checked,
					"pattern": in_pattern ? in_pattern.value : "",
					"lang": lang ? lang : "",
					"profile": profile ? profile : "default",
					"spoofIP": in_spoof.value,
					"options": {
						"auth": in_auth.checked,
						"ip": in_ip.checked,
						"ref": in_ref.checked,
						"timezone": in_tz.checked,
						"websocket": in_ws.checked,
						"winName": in_name.checked
					}
				});

				chrome.runtime.sendMessage({
					action: "whitelist",
					data: {
						key: "wl_urls",
						value: JSON.stringify(data.whitelist.urlList)
					}
				});

				window.location.reload(false);
			} else if (e.target.innerText == "Close") {
				document.getElementById('create').remove();
			} else if (e.target.innerText == "Create new rule") {
				var newRule = document.getElementById('create');

				if (newRule) newRule.remove();

				$('.content')[0].insertAdjacentHTML('afterbegin', `
					<div class="card text-left mt-2" style="background-color: #f7f8f9;" id="create">
					  <div class="card-header">
						<input class="form-input domain" type="text" placeholder="Enter domain">
						<button class="btn btn-success btn-sm d-inline-block mt-2">Create</button>
						<button class="btn btn-error btn-sm d-inline-block mt-2">Close</button>
					  </div>
					  <div class="divider"></div>
					  <div class="card-body">
					    <div class="container ">
					      <div class="columns">
					        <div class="column col-xs-6">
								<label class="form-switch">
									<input class="auth" type="checkbox">
									<i class="form-icon"></i> Disable auth header
								</label>
								<label class="form-switch">
									<input class="ref" type="checkbox">
									<i class="form-icon"></i> Disable Referer
								</label>
								<label class="form-switch">
									<input class="ws" type="checkbox">
									<i class="form-icon"></i> Disable WebSocket
								</label>
					        </div>
					        <div class="column col-xs-6">
					            <label class="form-switch">
					                <input class="ip" type="checkbox">
					                <i class="form-icon"></i> Enable IP headers
					            </label>
					            <label class="form-switch">
					                <input class="name" type="checkbox">
					                <i class="form-icon"></i> Enable Protect window name
					            </label>
					            <label class="form-switch">
					                <input class="tz" type="checkbox">
					                <i class="form-icon"></i> Enable Timezone Spoofing
					            </label>
					        </div>
					      </div>
					    </div>  
					    <label class="form-checkbox">
					        <input class="re" type="checkbox">
					        <i class="form-icon"></i> Regex enabled
					    </label>
					    <label class="form-label">
					        <i class="form-icon"></i> Header IP (Via & X-Forwarded For) 
					        <input class="form-input spoof" type="text">
					    </label>
		    		    ${languageTemplate('')}
		    		    ${whitelistTemplate('')}
					  </div>
					</div>
					`);	
			}
		} else if (e.target.parentNode.innerText == "Regex enabled") {
			if (e.target.checked) {
				$(e.target).parent()[0].insertAdjacentHTML('afterend', patternTemplate("",1, false));
			} else {
				$(e.target).parent().parent().find('.pattern').remove();
			}
		}
	});

	var u = new URL(window.location);
	var domain = u.searchParams.get("url");
	var mode = u.searchParams.get("mode");
	
	if (mode == "edit") {
		searchInput.val(domain);
		$('#searchInput').trigger('keyup');
		$('.card :button')[0].click();	
	} else if (mode == "create") {
		if (data.whitelist.urlList.findIndex(r => r.url.includes(domain)) == -1) {
			$('.header-container button')[0].click();
			$('.card .form-input.domain').val(domain);
		}
	}
});
