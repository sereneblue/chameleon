let data = null;

let patternTemplate = (pattern, regexEnabled, disabled) => {
	return regexEnabled ? `<input class="form-input pattern" type="text" value="${pattern}" ${disabled ? "disabled" : ""}>` : "";
};

let siteTemplate = (domains) => {
	if (domains) {
		let template = "";

		for (var i = 0; i < domains.length; i++) {
			template += `
			<div class="container my-2">
				<div class="columns">
					<div class="column col-4">
						<input class="form-input domain" type="text" placeholder="Enter domain" value="${domains[i].domain}">
					</div>
					<div class="column col-2">
						<label class="form-checkbox">
							<input class="re" type="checkbox" ${domains[i].re ? 'checked' : '' }>
							<i class="form-icon"></i> Regex enabled
						</label>
					</div>
					<div class="column col-5">
						<input class="form-input pattern ${domains[i].re ? '' : 'd-hide'}" type="text" placeholder="Enter pattern" value="${domains[i].pattern}">
					</div>
					<div class="column col-1">
						<button class="btn del-domain btn-error btn-sm d-inline-block mt-2">Delete</button>
					</div>
				</div>
			</div>`
		}
		return template;
	}
	return `
		<div class="container my-2">
			<div class="columns">
				<div class="column col-4">
					<input class="form-input domain" type="text" placeholder="Enter domain">
				</div>
				<div class="column col-2">
					<label class="form-checkbox">
						<input class="re" type="checkbox">
						<i class="form-icon"></i> Regex enabled
					</label>
				</div>
				<div class="column col-5">
					<input class="form-input pattern d-hide" type="text" placeholder="Enter pattern">
				</div>
				<div class="column col-1">
					<button class="btn del-domain btn-error btn-sm d-inline-block mt-2">Delete</button>
				</div>
			</div>
		</div>
	`;
}

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

function getDomainsDisplay(domains) {
	if (domains.length == 1) {
		return domains[0].domain;
	} else if (domains.length == 2) {
		return `${domains[0].domain}, ${domains[1].domain}`;
	} else {
		return `${domains[0].domain} + ${domains.length - 1} domains`;
	}
}

function buildWhitelist(rules) {
	let ruleElement = document.getElementById('rules');
	ruleElement.innerHTML = "";

	for (var rule of rules) {
		ruleElement.insertAdjacentHTML('beforeend', `
		<div class="card text-left mt-2" id="${rule.id}">
		  <div class="card-header">
			<div class="card-title h5 d-block"><strong>${getDomainsDisplay(rule.domains)}</strong></div>
			<div class="domains d-hide">
				${siteTemplate(rule.domains)}
			</div>
			<div class="edit-buttons">
				<button class="btn btn-primary btn-sm d-inline-block mt-2">Edit</button>
				<button class="btn btn-success btn-sm d-inline-block d-hide mt-2">Save</button>
				<button class="btn btn-primary btn-sm d-inline-block d-hide mt-2">Add domain</button>
				<button class="btn btn-error btn-sm d-inline-block mt-2">Delete</button>
			</div>
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
		let query = e.target.value.trim().toLowerCase();
		let matches = data.whitelist.urlList
					.filter(r => r.domains
							 .map(d => d.domain)
							 .findIndex(d => d.includes(query)) > -1);
		buildWhitelist(matches);
	});

	searchInput.val("");

	buildWhitelist(data.whitelist.urlList);

	$(document).click(function(e) {
		if (e.target.nodeName == "BUTTON") {
			if (e.target.innerText == "Add domain") {
				$(e.target).parents('.card').find('.domains')[0].insertAdjacentHTML('beforeend', siteTemplate());
			} else if (e.target.innerText == "Delete") {
				if (e.target.classList.contains("del-domain")) {
					$(e.target).parents('.container').remove();
				} else if (!document.querySelector('.confirmation')) {
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

				var parent = $(e.target).parents('.card');
				var buttons = parent.find('.edit-buttons button');

				parent.find(":input").prop("disabled", false);
				parent.find('.card-title').addClass('d-hide');
				parent.find('.card-body').removeClass('d-hide');
				parent.find('.domains').removeClass('d-hide');

				$(buttons[0]).addClass('d-hide');
				$(buttons[1]).removeClass('d-hide');
				$(buttons[2]).removeClass('d-hide');
			} else if (e.target.innerText == "Save") {
				var parent = $(e.target).parents('.card');
				var buttons = parent.find('.edit-buttons button');
				var lang = parent.find('select')[0].value
				var profile = parent.find('select')[1].value;

				// inputs
				let domains = [];
				let in_domain;
				let d;
				let in_re;
				let in_pattern;
				let found = false;

				let otherRules = data.whitelist.urlList
								.filter(r => r.id != parent.id)
								.map(rule => rules.domains);

				for (site of parent.find('.domains .container')) {
					in_domain = $(site).find('.domain')[0];
					d = in_domain.value.toLowerCase();
					in_re = $(site).find('.re')[0];
					in_pattern = $(site).find('.pattern')[0];

					if (d == "" || otherRules.includes(d) || domains.includes(d) || !/^(?:^|\s)((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/.test(d)) {
						in_domain.classList.add('is-error');
						return;
					}

					in_domain.classList.remove('is-error');

					if (in_re.checked && in_pattern.value == "") {
						in_pattern.classList.add('is-error');
						return;
					}

					in_pattern.classList.remove('is-error');

					domains.push({
						"domain": d,
						"re": in_re.checked,
						"pattern": in_pattern.value
					});
				}

				if (!domains.length) {
					return;
				}

				// inputs
				let in_spoof = parent.find('.spoof')[0];
				let in_auth = parent.find('.auth')[0];
				let in_ip = parent.find('.ip')[0];
				let in_ref = parent.find('.ref')[0];
				let in_name = parent.find('.name')[0];
				let in_ws = parent.find('.ws')[0];
				let in_tz = parent.find('.tz')[0];

				if (in_spoof.value) {
					if (!/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(in_spoof.value)) {
						in_spoof.classList.add('is-error');
						return;
					}
				}

				in_spoof.classList.remove('is-error');

				let index = data.whitelist.urlList.findIndex(rule => rule.id == parent[0].id);
				data.whitelist.urlList[index] = {
					"id": parent[0].id,
					"domains": domains,
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

				parent.find('.domains').addClass('d-hide');
				parent.find('.card-body').addClass('d-hide');

				parent.find('.card-title strong').text(getDomainsDisplay(domains));
				parent.find('.card-title').removeClass('d-hide');
				$(buttons[0]).removeClass('d-hide');
				$(buttons[1]).addClass('d-hide');
				$(buttons[2]).addClass('d-hide');
			} else if (e.target.innerText == "Yes") {
				var parent = $(e.target).parents('.card')[0];
				let index = data.whitelist.urlList.findIndex(rule => rule.id == parent.id);
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
				var parent = $(e.target).parents('.card');
				var inputs = parent.find(':input');
				var lang = parent.find('select')[0].value;
				var profile = parent.find('select')[1].value;

				// inputs
				let domains = [];
				let in_domain;
				let d;
				let in_re;
				let in_pattern;
				let found = false;

				for (site of parent.find('.domains .container')) {
					in_domain = $(site).find('.domain')[0];
					d = in_domain.value.trim().toLowerCase();
					in_re = $(site).find('.re')[0];
					in_pattern = $(site).find('.pattern')[0];

					found = data.whitelist.urlList
							.filter(r => r.domains
										.map(d => d.domain)
										.findIndex(s => s.includes(d)) > -1);

					if (d == "" || found.length || domains.includes(d) || !/^(?:^|\s)((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/.test(d)) {
						in_domain.classList.add('is-error');
						return;
					}

					in_domain.classList.remove('is-error');

					if (in_re.checked && in_pattern.value == "") {
						in_pattern.classList.add('is-error');
						return;
					}

					in_pattern.classList.remove('is-error');

					domains.push({
						"domain": d,
						"re": in_re.checked,
						"pattern": in_pattern.value
					});
				}

				if (!domains.length) {
					return;
				}

				let in_spoof = parent.find('.spoof')[0];
				let in_auth = parent.find('.auth')[0];
				let in_ip = parent.find('.ip')[0];
				let in_ref = parent.find('.ref')[0];
				let in_name = parent.find('.name')[0];
				let in_ws = parent.find('.ws')[0];
				let in_tz = parent.find('.tz')[0];

				if (in_spoof.value != "") {
					if (!/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(in_spoof.value)) {
						in_spoof.classList.add('is-error');
						return;
					}
				}

				in_spoof.classList.remove('is-error');

				data.whitelist.urlList.push({
					"id": Math.random().toString(36).substring(7),
					"domains": domains,
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
					  	<div class="domains">
							${siteTemplate()}
						</div>
						<button class="btn btn-success btn-sm d-inline-block mt-2">Create</button>
						<button class="btn btn-primary btn-sm d-inline-block mt-2">Add domain</button>
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
				let el = $(e.target).parents('.columns').find('.col-5 input')[0];
				el.classList.remove('d-hide');
				el.value = "";
			} else {
				let el = $(e.target).parents('.columns').find('.col-5 input')[0];
				el.classList.add('d-hide');
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
