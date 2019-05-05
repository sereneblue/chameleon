let data = null;

function get(key) {
	return new Promise((resolve) => {
		chrome.storage.local.get(key, (item) => {
			typeof key == "string" ? resolve(item[key]) : resolve(item);
		});
	});
}

function getIPRange(ip) {
	let cidr = new IPCIDR(ip);

	if (cidr.isValid()) {
		let range = cidr.toRange();

		return range[0] == range[1] ? "" : `{ ${range[0]} - ${range[1]} }`;
	}

	return "";
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
		template += `<option value="${t.zone}" ${t.zone == tz ? "selected" : ""}>${t.zone}</option>`
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
			      	<span class="display text-bold">${rule.ip}</span>
					<input class="form-input d-hide" type="text" value="${rule.ip}">
					<span class="range" style="color: rgba(0,0,0,0.5);">${getIPRange(rule.ip)}</span>
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
				<button class="btn edit-btn">Edit</button>
				<button class="btn save-btn d-hide">Save</button>
				<button class="btn btn-error del-btn">Delete</button>
  		      </td>
		    </tr>
		`)
	}
}

document.addEventListener('DOMContentLoaded', async function() {
	data = await get(null);

	buildTable(data.ipRules);

	$('#create').click(function (e) {
		if (!$('.create').length) {
			$('.content')[0].insertAdjacentHTML('afterbegin', `
				<div class="card text-left mt-2 create" style="background-color: #f7f8f9;">
				  <div class="card-header">
				  	<div class="form-group">
					  	<label>IP or CIDR</label>
						<input class="form-input ip" type="text" placeholder="Enter IP or CIDR">
					</div>
					<button id="saveRule" class="btn btn-success btn-sm d-inline-block mt-2">Create</button>
					<button id="close" class="btn btn-error btn-sm d-inline-block mt-2">Close</button>
				  </div>
				  <div class="divider"></div>
				  <div class="card-body">
					<label>Language</label>
	    		    ${languageTemplate('', true)}
				  	<label>Timezone</label>
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
		let ip = $('.create .ip')[0].value;
		let cidr = new IPCIDR(ip);

		if (!cidr.isValid()) {
			$('.create .card-header .form-group').addClass('has-error');
			return;
		}

		$('.create .card-header .form-group').removeClass('has-error');
		let lang = $('.create select')[0].value;
		let tz = $('.create select')[1].value;
		let ipRules = [];
		let rule = null;

		$('tbody tr').each(function () {
			rule = {};
			$(this).find('td .display').each(function (i) {
				var key =  i == 0 ? "ip" : (i == 1 ? "lang" : "tz"); 

				rule[key] = this.innerText;
			});

			ipRules.push(rule);
		})
		
		if (ipRules.findIndex(r => r.ip == ip) > -1) {
			$('.create .card-header .form-group').addClass('has-error');
			return;
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
			      	<span class="display text-bold">${ip}</span>
					<input class="form-input d-hide" type="text" value="${ip}">
					<span class="range" style="color: rgba(0,0,0,0.5);">${getIPRange(ip)}</span>
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
				<button class="btn edit-btn">Edit</button>
				<button class="btn save-btn d-hide">Save</button>
				<button class="btn btn-error del-btn">Delete</button>
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

		let ip = parent.find('input')[0].value;

		let cidr = new IPCIDR(ip);
k		
		if (!cidr.isValid()) {
			$('.create .card-header .form-group').addClass('has-error');
			return;
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

				rule[key] = this.innerText;
			});

			ipRules.push(rule);
		});

		
		if (ip != parent.find('.display')[0].innerText) {
			if (ipRules.findIndex(r => r.ip == ip) > -1) {
				parent.find('.form-group').addClass('has-error');
				return;
			}
		}

		parent.find('.form-group').removeClass('has-error');
		
		let idx = ipRules.findIndex(r => r.ip == parent.find('.display')[0].innerText);
		
		// only change if value was changed
		if (!(ipRules[idx].ip == ip && ipRules[idx].lang == lang && ipRules[idx].tz == tz)) {
			ipRules[idx].ip = ip;
			ipRules[idx].lang = lang;
			ipRules[idx].tz = tz;

			parent.find('.display')[0].innerText = ip;
			parent.find('.display')[1].innerText = lang;
			parent.find('.display')[2].innerText = tz;
			parent.find('.range')[0].innerText = getIPRange(ip);

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
