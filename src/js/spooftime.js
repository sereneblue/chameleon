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

let spoofTime = (offset, tzAbbr, tzName) => {
	return `
		var spoofedTimezone = 0 - ${offset};
		var tzAbbr = "${tzAbbr}";
		var tzName = "${tzName}";
		var timezoneOffset = new window.Date().getTimezoneOffset();

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
				return sign + z(offset / 60 | 0) + z(offset % 60);
			};
			str = str.replace(/(T[\\\\+|\\\\-]?\\\\d+)/g, toGMT(spoofedTimezone));

			if (str.indexOf(' (') !== -1) {
				str = str.split(' (')[0] + ' (' + tzAbbr + ')';
			}
			return str;
		}

		var ODate = window.Date;
		const {
			getTime, getDate, getDay, getFullYear, getHours, getMilliseconds, getMinutes, getMonth, getSeconds, getYear,
			toDateString, toLocaleString, toString, toTimeString, toLocaleTimeString, toLocaleDateString,
			setYear, setHours, setTime, setFullYear, setMilliseconds, setMinutes, setMonth, setSeconds, setDate,
			setUTCDate, setUTCFullYear, setUTCHours, setUTCMilliseconds, setUTCMinutes, setUTCMonth, setUTCSeconds
		} = ODate.prototype;

		class ShiftedDate extends ODate {
			constructor(...args) {
			  super(...args);
			  this.nd = new ODate(
				getTime.apply(this) + (timezoneOffset - spoofedTimezone) * 60 * 1000
			  );
			}
			toLocaleString(...args) {
			  return toLocaleString.apply(this.nd, args);
			}
			toLocaleTimeString(...args) {
			  return toLocaleTimeString.apply(this.nd, args);
			}
			toLocaleDateString(...args) {
			  return toLocaleDateString.apply(this.nd, args);
			}
			toDateString(...args) {
			  return toDateString.apply(this.nd, args);
			}
			getDate(...args) {
			  return getDate.apply(this.nd, args);
			}
			getDay(...args) {
			  return getDay.apply(this.nd, args);
			}
			getFullYear(...args) {
			  return getFullYear.apply(this.nd, args);
			}
			getHours(...args) {
			  return getHours.apply(this.nd, args);
			}
			getMilliseconds(...args) {
			  return getMilliseconds.apply(this.nd, args);
			}
			getMinutes(...args) {
			  return getMinutes.apply(this.nd, args);
			}
			getMonth(...args) {
			  return getMonth.apply(this.nd, args);
			}
			getSeconds(...args) {
			  return getSeconds.apply(this.nd, args);
			}
			getYear(...args) {
			  return getYear.apply(this.nd, args);
			}
			// set
			setHours(...args) {
			  const a = getTime.call(this.nd);
			  const b = setHours.apply(this.nd, args);
			  setTime.call(this, getTime.call(this) + b - a);
			  return b;
			}
			setFullYear(...args) {
			  const a = getTime.call(this.nd);
			  const b = setFullYear.apply(this.nd, args);
			  setTime.call(this, getTime.call(this) + b - a);
			  return b;
			}
			setMilliseconds(...args) {
			  const a = getTime.call(this.nd);
			  const b = setMilliseconds.apply(this.nd, args);
			  setTime.call(this, getTime.call(this) + b - a);
			  return b;
			}
			setMinutes(...args) {
			  const a = getTime.call(this.nd);
			  const b = setMinutes.apply(this.nd, args);
			  setTime.call(this, getTime.call(this) + b - a);
			  return b;
			}
			setMonth(...args) {
			  const a = getTime.call(this.nd);
			  const b = setMonth.apply(this.nd, args);
			  setTime.call(this, getTime.call(this) + b - a);
			  return b;
			}
			setSeconds(...args) {
			  const a = getTime.call(this.nd);
			  const b = setSeconds.apply(this.nd, args);
			  setTime.call(this, getTime.call(this) + b - a);
			  return b;
			}
			setDate(...args) {
			  const a = getTime.call(this.nd);
			  const b = setDate.apply(this.nd, args);
			  setTime.call(this, getTime.call(this) + b - a);
			  return b;
			}
			setYear(...args) {
			  const a = getTime.call(this.nd);
			  const b = setYear.apply(this.nd, args);
			  setTime.call(this, getTime.call(this) + b - a);
			  return b;
			}
			setTime(...args) {
			  const a = getTime.call(this);
			  const b = setTime.apply(this, args);
			  setTime.call(this.nd, getTime.call(this.nd) + b - a);
			  return b;
			}
			setUTCDate(...args) {
			  const a = getTime.call(this);
			  const b = setUTCDate.apply(this, args);
			  setTime.call(this.nd, getTime.call(this.nd) + b - a);
			  return b;
			}
			setUTCFullYear(...args) {
			  const a = getTime.call(this);
			  const b = setUTCFullYear.apply(this, args);
			  setTime.call(this.nd, getTime.call(this.nd) + b - a);
			  return b;
			}
			setUTCHours(...args) {
			  const a = getTime.call(this);
			  const b = setUTCHours.apply(this, args);
			  setTime.call(this.nd, getTime.call(this.nd) + b - a);
			  return b;
			}
			setUTCMilliseconds(...args) {
			  const a = getTime.call(this);
			  const b = setUTCMilliseconds.apply(this, args);
			  setTime.call(this.nd, getTime.call(this.nd) + b - a);
			  return b;
			}
			setUTCMinutes(...args) {
			  const a = getTime.call(this);
			  const b = setUTCMinutes.apply(this, args);
			  setTime.call(this.nd, getTime.call(this.nd) + b - a);
			  return b;
			}
			setUTCMonth(...args) {
			  const a = getTime.call(this);
			  const b = setUTCMonth.apply(this, args);
			  setTime.call(this.nd, getTime.call(this.nd) + b - a);
			  return b;
			}
			setUTCSeconds(...args) {
			  const a = getTime.call(this);
			  const b = setUTCSeconds.apply(this, args);
			  setTime.call(this.nd, getTime.call(this.nd) + b - a);
			  return b;
			}
			toString(...args) {
			  return clean(toString.apply(this.nd, args));
			}
			toTimeString(...args) {
			  return clean(toTimeString.apply(this.nd, args));
			}
			getTimezoneOffset() {
			  return spoofedTimezone;
			}
		  }

		window.Date = ShiftedDate;`;
}
