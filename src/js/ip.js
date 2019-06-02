let data = null;

function get(key) {
	return new Promise((resolve) => {
		chrome.storage.local.get(key, (item) => {
			typeof key == "string" ? resolve(item[key]) : resolve(item);
		});
	});
}

function getIPRange(ip) {
	let display = "";

	for (var i = 0; i < ip.length; i++) {
		let cidr = new IPCIDR(ip[i]);

		if (cidr.isValid()) {
			let range = cidr.toRange();

			display += range[0] == range[1] ? range[0] : `${range[0]} - ${range[1]}`;
		}

		if (i < ip.length - 1) {
			display += "<br/>";
		}
	}

	return display;
}

function languageTemplate(lang, visible=false) {
	let template = `<select class="form-select ${visible ? "" : "d-hide"}">`;

	for (var l of languages) {
		template += `<option value="${l.display}" ${l.display == lang ? "selected" : ""}>${l.display}</option>`
	}
	
	return template + `</select>`;
};

function timezoneTemplate(tz, visible=false) {
	let template = `<select class="form-select ${visible ? "" : "d-hide"}">`;

	for (var t of chameleonTimezones) {
		template += `<option value="${t.zone}" ${t.zone == tz ? "selected" : ""}>(${t.offset}) ${t.zone}</option>`
	}

	return template + `</select>`;
};

function buildTable(rules) {
	let ruleElement = document.querySelector('#rules table tbody');
	ruleElement.innerHTML = "";

	for (var rule of rules) {
		ruleElement.insertAdjacentHTML('beforeend', `
			<tr>
		      <td>
				<div class="form-group">
			      	<div class="display text-bold">${rule.ip}</div>
					<input class="form-input d-hide" type="text" value="${rule.ip}">
					<div class="range" style="color: rgba(0,0,0,0.5);">${getIPRange(rule.ip)}</div>
				</div>
	      	  </td>
		      <td>
				<span class="display">${rule.lang}</span>
				${languageTemplate(rule.lang)}
		      </td>
		      <td>
		      	<span class="display">${rule.tz}</span>
				${timezoneTemplate(rule.tz)}
		      </td>
  		      <td>
				<button class="btn edit-btn">${browser.i18n.getMessage("textEdit")}</button>
				<button class="btn save-btn d-hide">${browser.i18n.getMessage("textSave")}</button>
				<button class="btn btn-error del-btn">${browser.i18n.getMessage("textDelete")}</button>
  		      </td>
		    </tr>
		`)
	}
}

function localize() {
	$("title").text('Chameleon ' + browser.i18n.getMessage("ipRulesSubheader"));
	$("#subheader").text(browser.i18n.getMessage("ipRulesSubheader"));
	$("#create").text(browser.i18n.getMessage("ipRulesCreateRule"));
	$("#reload").html(browser.i18n.getMessage("ipRulesReloadIP"));
	$("#tip").html(browser.i18n.getMessage("ipRulesTip"));
	$("#instructions").html(browser.i18n.getMessage("ipRulesInstructions"));
	$("table thead th:eq(0)").text(browser.i18n.getMessage("ipRulesTableIPRange"));
	$("table thead th:eq(1)").text(browser.i18n.getMessage("ipRulesTableLanguage"));
	$("table thead th:eq(2)").text(browser.i18n.getMessage("ipRulesTableTimezone"));
	$("table thead th:eq(3)").text(browser.i18n.getMessage("ipRulesTableActions"));
}

document.addEventListener('DOMContentLoaded', async function() {
	data = await get(null);

	localize();
	buildTable(data.ipRules);

	$('#create').click(function (e) {
		if (!$('.create').length) {
			$('.content')[0].insertAdjacentHTML('afterbegin', `
				<div class="card text-left mt-2 create" style="background-color: #f7f8f9;">
				  <div class="card-header">
				  	<div class="form-group">
					  	<label>${browser.i18n.getMessage("ipRulesCIDR")}</label>
						<input class="form-input ip" type="text" placeholder="${browser.i18n.getMessage("ipRulesCIDRPlaceholder")}">
					</div>
					<button id="saveRule" class="btn btn-success btn-sm d-inline-block mt-2">${browser.i18n.getMessage("textCreate")}</button>
					<button id="close" class="btn btn-error btn-sm d-inline-block mt-2">${browser.i18n.getMessage("textClose")}</button>
				  </div>
				  <div class="divider"></div>
				  <div class="card-body">
					<label>${browser.i18n.getMessage("textLanguage")}</label>
	    		    ${languageTemplate('', true)}
				  	<label>${browser.i18n.getMessage("textTimezone")}</label>
	    		    ${timezoneTemplate('', true)}
				  </div>
				</div>
			`);		
		}
	});

	$('#reload').click(function (e) {
		chrome.runtime.sendMessage({
			action: "reloadIP"
		});
	});

	$(document).on('click', '#close', function (e) {
		$('.create')[0].remove();
	});

	$(document).on('click', '#saveRule', function (e) {
		let ip = $('.create .ip')[0].value.split(',').map(i => i.trim());

		for (var i = 0; i < ip.length; i++) {
			let cidr = new IPCIDR(ip[i]);

			if (!cidr.isValid()) {
				$('.create .card-header .form-group').addClass('has-error');
				return;
			}
		}

		$('.create .card-header .form-group').removeClass('has-error');
		let lang = $('.create select')[0].value;
		let tz = $('.create select')[1].value;
		let ipRules = [];
		let rule = null;

		$('tbody tr').each(function () {
			rule = {};
			$(this).find('td .display').each(function (i) {
				var key = i == 0 ? "ip" : (i == 1 ? "lang" : "tz"); 

				rule[key] = key == "ip" ? this.innerText.split(",") : this.innerText;
			});

			ipRules.push(rule);
		})

		ipRules.flat();
		
		for (var i = 0; i < ip.length; i++) {
			if (ipRules.includes(ip[i])) {
				$('.create .card-header .form-group').addClass('has-error');
				return;
			}
		}

		$('.create .card-header .form-group').removeClass('has-error');

		ipRules.push({
			ip,
			lang,
			tz
		});

		$('.create')[0].remove();
		let ruleElement = document.querySelector('#rules table tbody');

		ruleElement.insertAdjacentHTML('beforeend', `
			<tr>
		      <td>
			  	<div class="form-group">
			      	<div class="display text-bold">${ip.join(',')}</div>
					<input class="form-input d-hide" type="text" value="${ip.join(',')}">
					<div class="range" style="color: rgba(0,0,0,0.5);">${getIPRange(ip)}</div>
				</div>
	      	  </td>
		      <td>
				<span class="display">${lang}</span>
				${languageTemplate(lang)}
		      </td>
		      <td>
		      	<span class="display">${tz}</span>
				${timezoneTemplate(tz)}
		      </td>
  		      <td>
				<button class="btn edit-btn">${browser.i18n.getMessage("textEdit")}</button>
				<button class="btn save-btn d-hide">${browser.i18n.getMessage("textSave")}</button>
				<button class="btn btn-error del-btn">${browser.i18n.getMessage("textDelete")}</button>
  		      </td>
		    </tr>
		`)

		chrome.runtime.sendMessage({
			action: "ipRules",
			data: ipRules
		});
	});

	$(document).on('click', '.edit-btn', function (e) {
		let parent = $(e.target).parent().parent();

		parent.find('.d-hide').removeClass('d-hide');
		parent.find('.edit-btn').addClass('d-hide');
		parent.find('.display').addClass('d-hide');
		parent.find('.range').addClass('d-hide');
	})

	$(document).on('click', '.del-btn', function (e) {
		$(e.target).parent().parent().remove();

		let ipRules = [];
		let rule = null;

		$('tbody tr').each(function () {
			rule = {};
			$(this).find('td .display').each(function (i) {
				var key =  i == 0 ? "ip" : (i == 1 ? "lang" : "tz"); 

				rule[key] = this.innerText;
			});

			ipRules.push(rule);
		});

		chrome.runtime.sendMessage({
			action: "ipRules",
			data: ipRules
		});
	})


	$(document).on('click', '.save-btn', function (e) {
		let parent = $(e.target).parent().parent();

		let ip = parent.find('input')[0].value.split(',').map(i => i.trim());

		for (var i = 0; i < ip.length; i++) {
			let cidr = new IPCIDR(ip[i]);

			if (!cidr.isValid()) {
				parent.find('.form-group').addClass('has-error');
				return;
			}
		}

		parent.find('.form-group').removeClass('has-error');
		let lang = parent.find('select')[0].value;
		let tz = parent.find('select')[1].value;
		let ipRules = [];
		let rule = null;

		$('tbody tr').each(function () {
			rule = {};
			$(this).find('td .display').each(function (i) {
				var key =  i == 0 ? "ip" : (i == 1 ? "lang" : "tz"); 

				rule[key] = key == "ip" ? this.innerText.split(",") : this.innerText;
			});

			ipRules.push(rule);
		});

		ipRules.flat();
		
		// check if already created rule
		if (ip != parent.find('.display')[0].innerText) {
			if (ipRules.includes(ip)) {
				parent.find('.form-group').addClass('has-error');
				return;
			}
		}

		// check if any ip in input exists in rules
		for (var i = 0; i < ip.length; i++) {
			if (ipRules.includes(ip[i])) {
				parent.find('.form-group').addClass('has-error');
				return;
			}
		}

		parent.find('.form-group').removeClass('has-error');
		
		let idx = ipRules.findIndex(r => r.ip == parent.find('.display')[0].innerText);
		
		// only change if value was changed
		if (!(ipRules[idx].ip.join(',') == ip.join(',') && ipRules[idx].lang == lang && ipRules[idx].tz == tz)) {
			ipRules[idx].ip = ip;
			ipRules[idx].lang = lang;
			ipRules[idx].tz = tz;

			parent.find('.display')[0].innerText = ip;
			parent.find('.display')[1].innerText = lang;
			parent.find('.display')[2].innerText = tz;
			parent.find('.range')[0].innerHTML = getIPRange(ip);

			chrome.runtime.sendMessage({
				action: "ipRules",
				data: ipRules
			});
		}

		parent.find('.d-hide').removeClass('d-hide');
		parent.find('.range').removeClass('d-hide');
		parent.find('.save-btn').addClass('d-hide');
		parent.find('input').addClass('d-hide');
		parent.find('select').addClass('d-hide');
	})
});
