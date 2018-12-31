/*
	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this file,
	You can obtain one at http://mozilla.org/MPL/2.0/.

	Copyright (c) 2018, Joue Quroi https://github.com/joue-quroi
	
	Alternatively, the contents of this file may be used under the terms
	of the GNU General Public License Version 3, as described below:

	This file is free software: you may copy, redistribute and/or modify
	it under the terms of the GNU General Public License as published by the
	Free Software Foundation, either version 3 of the License, or (at your
	option) any later version.

	This file is distributed in the hope that it will be useful, but
	WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
	Public License for more details.
*/

let spoofTime = (offset, tzAbbr, tzName, randomStr) => {
	return `
		var spoofedTimezone = 0 - ${offset};
		var tzAbbr = "${tzAbbr}";
		var tzName = "${tzName}";

		const timezoneOffset = new window.Date().getTimezoneOffset();
		const intl = window.Intl.DateTimeFormat.prototype.resolvedOptions;
		window.Intl.DateTimeFormat.prototype.resolvedOptions = function(...args) {
			return Object.assign(intl.apply(this, args), {
				timeZone: tzName
			});
		};

		const clean = str => {
			const toGMT = offset => {
				const z = n => (n < 10 ? '0' : '') + n;
				const sign = offset <= 0 ? '+' : '-';
				offset = Math.abs(offset);
				return "GMT" + sign + z(offset / 60 | 0) + z(offset % 60);
			};
			str = str.replace(/(GMT[\\\\+|\\\\-]?\\\\d+)/g, toGMT(spoofedTimezone));

			if (str.indexOf(' (') !== -1) {
				str = str.split(' (')[0] + ' (' + tzAbbr + ')';
			}
			return str;
		}

		let _d = window.Date;
		const {
			getDate, getDay, getFullYear, getHours, getMilliseconds, getMinutes, getMonth, getSeconds, getYear,
			toLocaleString, toLocaleDateString, toLocaleTimeString, toDateString, toTimeString
		} = _d.prototype;
		Date = function(...args) {
			let originalDate = new _d(...args);

			if (args.length == 0) {
				originalDate["${randomStr}"] = (timezoneOffset - spoofedTimezone) * 60000;		
				if (this instanceof Date) return originalDate;

				return originalDate.toString();
			}

			originalDate["${randomStr}"] = 0;
			
			if (this instanceof Date) return originalDate;
			
			return originalDate.toString();
		};
		Date.prototype = _d.prototype;
		Date.UTC = _d.UTC;
		Date.now = _d.now;
		Date.parse = _d.parse;
		Date.prototype.getDate = function(){
			if (!this["${randomStr}"]) return getDate.apply(this);
			var tmp = new _d(this.getTime() + this["${randomStr}"]);
			return getDate.apply(tmp);
		}
		Date.prototype.getDay = function(){
			if (!this["${randomStr}"]) return getDay.apply(this);
			var tmp = new _d(this.getTime() + this["${randomStr}"]);
			return getDay.apply(tmp);
		}
		Date.prototype.getFullYear = function(){
			if (!this["${randomStr}"]) return getFullYear.apply(this);
			var tmp = new _d(this.getTime() + this["${randomStr}"]);
			return getFullYear.apply(tmp);
		}
		Date.prototype.getHours = function(){
			if (!this["${randomStr}"]) return getHours.apply(this);
			var tmp = new _d(this.getTime() + this["${randomStr}"]);
			return getHours.apply(tmp);
		}
		Date.prototype.getMilliseconds = function(){
			if (!this["${randomStr}"]) return getMilliseconds.apply(this);
			var tmp = new _d(this.getTime() + this["${randomStr}"]);
			return getMilliseconds.apply(tmp);
		}
		Date.prototype.getMinutes = function(){
			if (!this["${randomStr}"]) return getMinutes.apply(this);
			var tmp = new _d(this.getTime() + this["${randomStr}"]);
			return getMinutes.apply(tmp);
		}
		Date.prototype.getMonth = function(){
			if (!this["${randomStr}"]) return getMonth.apply(this);
			var tmp = new _d(this.getTime() + this["${randomStr}"]);
			return getMonth.apply(tmp);
		}
		Date.prototype.getSeconds = function(){
			if (!this["${randomStr}"]) return getSeconds.apply(this);
			var tmp = new _d(this.getTime() + this["${randomStr}"]);
			return getSeconds.apply(tmp);
		}
		Date.prototype.getYear = function(){
			if (!this["${randomStr}"]) return getYear.apply(this);
			var tmp = new _d(this.getTime() + this["${randomStr}"]);
			return getYear.apply(tmp);
		}
		Date.prototype.toString = function(){
			var tmp = new _d(this.getTime() + this["${randomStr}"]);
			return clean(toDateString.apply(tmp) + " " + toTimeString.apply(tmp));
		}
		Date.prototype.toLocaleString = function(){
			var tmp = new _d(this.getTime() + this["${randomStr}"]);
			return toLocaleString.apply(tmp);
		}
		Date.prototype.toLocaleDateString = function(){
			var tmp = new _d(this.getTime() + this["${randomStr}"]);
			return toLocaleDateString.apply(tmp);
		}
		Date.prototype.toLocaleTimeString = function(){
			var tmp = new _d(this.getTime() + this["${randomStr}"]);
			return toLocaleTimeString.apply(tmp);
		}
		Date.prototype.getTimezoneOffset = function(){
			if (!this["${randomStr}"]) return timezoneOffset;
			return spoofedTimezone;
		}

		document.addEventListener('DOMContentLoaded', function () {
		    Element.prototype.appendChild = function(oAppend, topDate) {
		    	return function() {
		    		var tmp = oAppend.apply(this, arguments);
		    		if (arguments[0].nodeName == "IFRAME" && arguments[0].contentWindow != null) {
						const intlIframe = arguments[0].contentWindow.Intl.DateTimeFormat.prototype.resolvedOptions;
						arguments[0].contentWindow.Intl.DateTimeFormat.prototype.resolvedOptions = function(...args) {
							return Object.assign(intlIframe.apply(this, args), {
								timeZone: tzName
							});
						};

						arguments[0].contentWindow.Date = topDate;
		    		}

		    		return tmp;
		    	}
		    }(Element.prototype.appendChild, Date);
		});
	`;
}