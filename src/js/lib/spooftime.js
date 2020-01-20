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

let spoofTime = (randomStr) => {
	return `
		var spoofedTimezone = 0 - offset;
		var _tz = {};

		_tz.orig = new Intl.DateTimeFormat('en-US', {
			timeZoneName: 'long'
		}).format(new Date()).split(', ')[1];
		
		_tz.spoof = new Intl.DateTimeFormat('en', {
			timeZone: tzName, timeZoneName: 'long'
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
		const getThis = t => {
			return t["${randomStr}"] ? t["${randomStr}"] : t;
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
				originalDate["${randomStr}"] = new _d(originalDate.getTime() + (timezoneOffset - spoofedTimezone) * 60000);

				if (this instanceof Date) return originalDate;

				return originalDate.toString();
			}
			
			if (this instanceof Date) return originalDate;
			
			return originalDate.toString();
		};
		Date.prototype = _d.prototype;
		Date.UTC = _d.UTC;
		Date.now = _d.now;
		Date.parse = _d.parse;
		Date.prototype.getDate = function(){
			return getDate.apply(getThis(this));
		}
		Date.prototype.getDay = function(){
			return getDay.apply(getThis(this));
		}
		Date.prototype.getFullYear = function(){
			return getFullYear.apply(getThis(this));
		}
		Date.prototype.getHours = function(){
			return getHours.apply(getThis(this));
		}
		Date.prototype.getMilliseconds = function(){
			return getMilliseconds.apply(getThis(this));
		}
		Date.prototype.getMinutes = function(){
			return getMinutes.apply(getThis(this));
		}
		Date.prototype.getMonth = function(){
			return getMonth.apply(getThis(this));
		}
		Date.prototype.getSeconds = function(){
			return getSeconds.apply(getThis(this));
		}
		Date.prototype.getYear = function(){
			return getYear.apply(getThis(this));
		}
		Date.prototype.toString = function(){
			return clean(toDateString.apply(getThis(this)) + " " + toTimeString.apply(getThis(this)));
		}
		Date.prototype.toLocaleString = function(...args){
			return clean(toLocaleString.apply(getThis(this)));
		}
		Date.prototype.toLocaleDateString = function(...args){
			return clean(toLocaleDateString.apply(getThis(this), args));
		}
		Date.prototype.toLocaleTimeString = function(...args){
			return clean(toLocaleTimeString.apply(getThis(this), args));
		}
		Date.prototype.toTimeString = function(){
			return clean(toTimeString.apply(getThis(this)));
		}
		Date.prototype.getTimezoneOffset = function(){
			return this["${randomStr}"] ? spoofedTimezone : timezoneOffset;
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

		window.Intl.DateTimeFormat.supportedLocalesOf = _d2.supportedLocalesOf;

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