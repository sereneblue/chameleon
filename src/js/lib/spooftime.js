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
		var _tz = {};

		_tz.orig = new Intl.DateTimeFormat('en-US', {
			timeZoneName: 'long'
		}).format(new Date()).split(', ')[1];
		
		_tz.spoof = new Intl.DateTimeFormat('en', {
			timeZone: tzName, timeZoneName: _oldFF ? 'short' : 'long'
		}).format(new Date()).split(', ')[1];

		const timezoneOffset = new window.Date().getTimezoneOffset();
		const clean = str => {
			const toGMT = offset => {
				const z = n => (n < 10 ? '0' : '') + n;
				const sign = offset <= 0 ? '+' : '-';
				offset = Math.abs(offset);
				return "GMT" + sign + z(offset / 60 | 0) + z(offset % 60);
			};
			str = str.replace(/(GMT[\\\\+|\\\\-]?\\\\d+)/g, toGMT(spoofedTimezone));
			return str.replace(_tz.orig, _tz.spoof);
		}

		let _d = window.Date;
		let _d2 = Intl.DateTimeFormat;
		
		const {
			getDate, getDay, getFullYear, getHours, getMilliseconds, getMinutes, getMonth, getSeconds, getYear,
			toLocaleString, toLocaleDateString, toLocaleTimeString, toDateString, toString, toTimeString
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
			if (!this["${randomStr}"]) return toString.apply(this);

			var tmp = new _d(this.getTime() + this["${randomStr}"]);
			return clean(toDateString.apply(tmp) + " " + toTimeString.apply(tmp));
		}
		Date.prototype.toLocaleString = function(...args){
			if (!this["${randomStr}"]) return toLocaleString.apply(this);

			var tmp = new _d(this.getTime() + this["${randomStr}"]);
			return clean(toLocaleString.apply(tmp, args));
		}
		Date.prototype.toLocaleDateString = function(...args){
			if (!this["${randomStr}"]) return toLocaleDateString.apply(this);

			var tmp = new _d(this.getTime() + this["${randomStr}"]);
			return clean(toLocaleDateString.apply(tmp, args));
		}
		Date.prototype.toLocaleTimeString = function(...args){
			if (!this["${randomStr}"]) return toLocaleTimeString.apply(this);

			var tmp = new _d(this.getTime() + this["${randomStr}"]);
			return clean(toLocaleTimeString.apply(tmp, args));
		}
		Date.prototype.toTimeString = function(){
			if (!this["${randomStr}"]) return toTimeString.apply(this);

			var tmp = new _d(this.getTime() + this["${randomStr}"]);
			return clean(toTimeString.apply(tmp));
		}
		Date.prototype.getTimezoneOffset = function(){
			if (!this["${randomStr}"]) return timezoneOffset;
			return spoofedTimezone;
		}
		
		window.Intl.DateTimeFormat = function(...args) {
			let locale = navigator.language || "en";

			if (args.length == 2) {
				if (!args[1].timeZone) {
					args[1].timeZone = tzName;
				}
				if (!args[1].locale) {
					args[1].locale = locale;
				}
			} else if (args.length == 1) {
				args.push({
					timeZone: tzName
				});
			} else {
				args = [
					locale,
					{ timeZone: tzName }
				];
			}

			return _d2.apply(null, args);
		}

	    Element.prototype.appendChild = function(oAppend, topDate, topIntl) {
	    	return function() {
	    		var tmp = oAppend.apply(this, arguments);

	    		if (tmp.nodeName == "IFRAME" && tmp.contentWindow != null) {
					tmp.contentWindow.Date = topDate;
					tmp.contentWindow.Intl.DateTimeFormat = topIntl;
	    		}

	    		return tmp;
	    	}
	    }(Element.prototype.appendChild, Date, Intl.DateTimeFormat);
	`;
}