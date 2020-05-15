export default {
  type :  'custom',
  data :  `
  var ORIGINAL_DATE = window.Date;
  
  const {
    getDate, getDay, getFullYear, getHours, getMinutes, getMonth, getTimezoneOffset,
    setDate, setFullYear, setHours, setMinutes, setMilliseconds, setMonth,
    setUTCDate, setUTCFullYear, setUTCHours, setUTCMinutes, setUTCMilliseconds, setUTCMonth,
    setUTCSeconds, toDateString, toLocaleString, toLocaleDateString, toLocaleTimeString, toTimeString
  } = ORIGINAL_DATE.prototype;

  const supportedLocalesOf = ORIGINAL_INTL.supportedLocalesOf;
  const TZ_LONG = new ORIGINAL_DATE().toLocaleDateString(undefined, { timeZoneName: 'long' }).split(', ')[1];
  const TZ_SHORT = new ORIGINAL_DATE().toLocaleDateString(undefined, { timeZoneName: 'short' }).split(', ')[1];

  const modifyDate = (d) => {
    let timestamp = d.getTime();
    let spoofData = Object.assign({}, CHAMELEON_SPOOF.get(window).timezone);
    let offsetIndex = spoofData.zone.untils.findIndex(o => o === null || (timestamp < o) );
    let offsetNum = spoofData.zone.offsets[offsetIndex];

    let offsetStr = \`\${offsetNum < 0 ? '+' : '-' }\${String(Math.abs(offsetNum / 60)).padStart(2, '0')}\${String(offsetNum % 60).padStart(2, '0')}\`;
    let tzName = ORIGINAL_INTL('en-us', { timeZone: spoofData.zone.name, timeZoneName: 'long'}).format(d).split(', ')[1];
    
    spoofData.date = new ORIGINAL_DATE(toLocaleString.apply(d, [ spoofData.locale, { timeZone: spoofData.zone.name }]));
    spoofData.zoneInfo = {
      offsetStr,
      offsetNum,
      tzAbbr: spoofData.zone.abbrs[offsetIndex],
      tzName
    };

    d[window.CHAMELEON_SPOOF] = spoofData;

    return d;
  } 

  window.Date = function(...args) {
    let tmp = this instanceof Date ? new ORIGINAL_DATE(...args) : new ORIGINAL_DATE();
    let timestamp = tmp.getTime();

    if (isNaN(timestamp)) {
      return tmp;
    }

    modifyDate(tmp);

    return (this instanceof Date) ? tmp : tmp.toString();
  };
  
  window.Date.prototype = ORIGINAL_DATE.prototype;
  window.Date.UTC = ORIGINAL_DATE.UTC;
  window.Date.now = ORIGINAL_DATE.now;
  window.Date.parse = ORIGINAL_DATE.parse;

  window.Date.prototype.getDate = function() {
    if (isNaN(this.getTime())) {
      return NaN;
    }
    return getDate.apply(this[window.CHAMELEON_SPOOF].date);
  }
  window.Date.prototype.getDay = function() {
    if (isNaN(this.getTime())) {
      return NaN;
    }
    return getDay.apply(this[window.CHAMELEON_SPOOF].date);
  }
  window.Date.prototype.getFullYear = function() {
    if (isNaN(this.getTime())) {
      return NaN;
    }

    if (!this[window.CHAMELEON_SPOOF]) modifyDate(this);

    return getFullYear.apply(this[window.CHAMELEON_SPOOF].date);
  }
  window.Date.prototype.getHours = function(){
    if (isNaN(this.getTime())) {
      return NaN;
    }

    if (!this[window.CHAMELEON_SPOOF]) modifyDate(this);

    return getHours.apply(this[window.CHAMELEON_SPOOF].date);
  }
  window.Date.prototype.getMinutes = function() {
    if (isNaN(this.getTime())) {
      return NaN;
    }

    if (!this[window.CHAMELEON_SPOOF]) modifyDate(this);

    return getMinutes.apply(this[window.CHAMELEON_SPOOF].date);
  }
  window.Date.prototype.getMonth = function() {
    if (isNaN(this.getTime())) {
      return NaN;
    }
    
    if (!this[window.CHAMELEON_SPOOF]) modifyDate(this);

    return getMonth.apply(this[window.CHAMELEON_SPOOF].date);
  }
  window.Date.prototype.getTimezoneOffset = function() {
    if (isNaN(this.getTime())) {
      return NaN;
    }

    if (!this[window.CHAMELEON_SPOOF]) modifyDate(this);

    return this[window.CHAMELEON_SPOOF].zoneInfo.offsetNum;
  }
  window.Date.prototype.setDate = function(...args) {
    if (isNaN(this.getTime())) {
      return NaN;
    }
    let nd = setDate.apply(this, args);
    let tmp = new ORIGINAL_DATE(nd);

    let spoofData = Object.assign({}, CHAMELEON_SPOOF.get(window).timezone);
    let offsetIndex = spoofData.zone.untils.findIndex(o => o === null || (nd < o) );
    let offsetNum = spoofData.zone.offsets[offsetIndex];

    let offsetStr = \`\${offsetNum < 0 ? '+' : '-' }\${String(Math.abs(offsetNum / 60)).padStart(2, '0')}\${String(offsetNum % 60).padStart(2, '0')}\`;
    let tzName = ORIGINAL_INTL('en-us', { timeZone: spoofData.zone.name, timeZoneName: 'long'}).format(this).split(', ')[1];

    spoofData.date = new ORIGINAL_DATE(toLocaleString.apply(this, [ spoofData.locale, { timeZone: spoofData.zone.name }]));
    spoofData.zoneInfo = {
      offsetStr,
      offsetNum,
      tzAbbr: spoofData.zone.abbrs[offsetIndex],
      tzName
    };
    nd[window.CHAMELEON_SPOOF] = spoofData;
    return nd;
  }
  window.Date.prototype.setFullYear = function(...args) {
    let timestamp = this.getTime();
    if (isNaN(timestamp)) {
      return NaN;
    }
    let nd = setFullYear.apply(this, args);
    let spoofData = Object.assign({}, CHAMELEON_SPOOF.get(window).timezone);
    let offsetIndex = spoofData.zone.untils.findIndex(o => o === null || (timestamp < o) );
    let offsetNum = spoofData.zone.offsets[offsetIndex];

    let offsetStr = \`\${offsetNum < 0 ? '+' : '-' }\${String(Math.abs(offsetNum / 60)).padStart(2, '0')}\${String(offsetNum % 60).padStart(2, '0')}\`;
    let tzName = ORIGINAL_INTL('en-us', { timeZone: spoofData.zone.name, timeZoneName: 'long'}).format(this).split(', ')[1];

    spoofData.date = new ORIGINAL_DATE(toLocaleString.apply(this, [ spoofData.locale, { timeZone: spoofData.zone.name }]));
    spoofData.zoneInfo = {
      offsetStr,
      offsetNum,
      tzAbbr: spoofData.zone.abbrs[offsetIndex],
      tzName
    };
    nd[window.CHAMELEON_SPOOF] = spoofData;
    return nd;
  }
  window.Date.prototype.setHours = function(...args) {
    let timestamp = this.getTime();
    if (isNaN(timestamp)) {
      return NaN;
    }
    let nd = setHours.apply(this, args);
    let spoofData = Object.assign({}, CHAMELEON_SPOOF.get(window).timezone);
    let offsetIndex = spoofData.zone.untils.findIndex(o => o === null || (timestamp < o) );
    let offsetNum = spoofData.zone.offsets[offsetIndex];

    let offsetStr = \`\${offsetNum < 0 ? '+' : '-' }\${String(Math.abs(offsetNum / 60)).padStart(2, '0')}\${String(offsetNum % 60).padStart(2, '0')}\`;
    let tzName = ORIGINAL_INTL('en-us', { timeZone: spoofData.zone.name, timeZoneName: 'long'}).format(this).split(', ')[1];

    spoofData.date = new ORIGINAL_DATE(toLocaleString.apply(this, [ spoofData.locale, { timeZone: spoofData.zone.name }]));
    spoofData.zoneInfo = {
      offsetStr,
      offsetNum,
      tzAbbr: spoofData.zone.abbrs[offsetIndex],
      tzName
    };
    nd[window.CHAMELEON_SPOOF] = spoofData;
    return nd;
  }
  window.Date.prototype.setMilliseconds = function(...args) {
    let timestamp = this.getTime();
    if (isNaN(timestamp)) {
      return NaN;
    }
    let nd = setMilliseconds.apply(this, args);
    let spoofData = Object.assign({}, CHAMELEON_SPOOF.get(window).timezone);
    let offsetIndex = spoofData.zone.untils.findIndex(o => o === null || (timestamp < o) );
    let offsetNum = spoofData.zone.offsets[offsetIndex];

    let offsetStr = \`\${offsetNum < 0 ? '+' : '-' }\${String(Math.abs(offsetNum / 60)).padStart(2, '0')}\${String(offsetNum % 60).padStart(2, '0')}\`;
    let tzName = ORIGINAL_INTL('en-us', { timeZone: spoofData.zone.name, timeZoneName: 'long'}).format(this).split(', ')[1];

    spoofData.date = new ORIGINAL_DATE(toLocaleString.apply(this, [ spoofData.locale, { timeZone: spoofData.zone.name }]));
    spoofData.zoneInfo = {
      offsetStr,
      offsetNum,
      tzAbbr: spoofData.zone.abbrs[offsetIndex],
      tzName
    };
    nd[window.CHAMELEON_SPOOF] = spoofData;
    return nd;
  }
  window.Date.prototype.setMonth = function(...args) {
    let timestamp = this.getTime();
    if (isNaN(timestamp)) {
      return NaN;
    }
    let nd = setMonth.apply(this, args);
    let spoofData = Object.assign({}, CHAMELEON_SPOOF.get(window).timezone);
    let offsetIndex = spoofData.zone.untils.findIndex(o => o === null || (timestamp < o) );
    let offsetNum = spoofData.zone.offsets[offsetIndex];

    let offsetStr = \`\${offsetNum < 0 ? '+' : '-' }\${String(Math.abs(offsetNum / 60)).padStart(2, '0')}\${String(offsetNum % 60).padStart(2, '0')}\`;
    let tzName = ORIGINAL_INTL('en-us', { timeZone: spoofData.zone.name, timeZoneName: 'long'}).format(this).split(', ')[1];

    spoofData.date = new ORIGINAL_DATE(toLocaleString.apply(this, [ spoofData.locale, { timeZone: spoofData.zone.name }]));
    spoofData.zoneInfo = {
      offsetStr,
      offsetNum,
      tzAbbr: spoofData.zone.abbrs[offsetIndex],
      tzName
    };
    nd[window.CHAMELEON_SPOOF] = spoofData;
    return nd;
  }
  window.Date.prototype.setUTCDate = function(...args) {
    let timestamp = this.getTime();
    if (isNaN(timestamp)) {
      return NaN;
    }
    let nd = setUTCDate.apply(this, args);
    let spoofData = Object.assign({}, CHAMELEON_SPOOF.get(window).timezone);
    let offsetIndex = spoofData.zone.untils.findIndex(o => o === null || (timestamp < o) );
    let offsetNum = spoofData.zone.offsets[offsetIndex];

    let offsetStr = \`\${offsetNum < 0 ? '+' : '-' }\${String(Math.abs(offsetNum / 60)).padStart(2, '0')}\${String(offsetNum % 60).padStart(2, '0')}\`;
    let tzName = ORIGINAL_INTL('en-us', { timeZone: spoofData.zone.name, timeZoneName: 'long'}).format(this).split(', ')[1];

    spoofData.date = new ORIGINAL_DATE(toLocaleString.apply(this, [ spoofData.locale, { timeZone: spoofData.zone.name }]));
    spoofData.zoneInfo = {
      offsetStr,
      offsetNum,
      tzAbbr: spoofData.zone.abbrs[offsetIndex],
      tzName
    };
    nd[window.CHAMELEON_SPOOF] = spoofData;
    return nd;
  }
  window.Date.prototype.setUTCFullYear = function(...args) {
    let timestamp = this.getTime();
    if (isNaN(timestamp)) {
      return NaN;
    }
    let nd = setUTCFullYear.apply(this, args);
    let spoofData = Object.assign({}, CHAMELEON_SPOOF.get(window).timezone);
    let offsetIndex = spoofData.zone.untils.findIndex(o => o === null || (timestamp < o) );
    let offsetNum = spoofData.zone.offsets[offsetIndex];

    let offsetStr = \`\${offsetNum < 0 ? '+' : '-' }\${String(Math.abs(offsetNum / 60)).padStart(2, '0')}\${String(offsetNum % 60).padStart(2, '0')}\`;
    let tzName = ORIGINAL_INTL('en-us', { timeZone: spoofData.zone.name, timeZoneName: 'long'}).format(this).split(', ')[1];

    spoofData.date = new ORIGINAL_DATE(toLocaleString.apply(this, [ spoofData.locale, { timeZone: spoofData.zone.name }]));
    spoofData.zoneInfo = {
      offsetStr,
      offsetNum,
      tzAbbr: spoofData.zone.abbrs[offsetIndex],
      tzName
    };
    nd[window.CHAMELEON_SPOOF] = spoofData;
    return nd;
  }
  window.Date.prototype.setUTCHours = function(...args) {
    let timestamp = this.getTime();
    if (isNaN(timestamp)) {
      return NaN;
    }
    let nd = setUTCHours.apply(this, args);
    let spoofData = Object.assign({}, CHAMELEON_SPOOF.get(window).timezone);
    let offsetIndex = spoofData.zone.untils.findIndex(o => o === null || (timestamp < o) );
    let offsetNum = spoofData.zone.offsets[offsetIndex];

    let offsetStr = \`\${offsetNum < 0 ? '+' : '-' }\${String(Math.abs(offsetNum / 60)).padStart(2, '0')}\${String(offsetNum % 60).padStart(2, '0')}\`;
    let tzName = ORIGINAL_INTL('en-us', { timeZone: spoofData.zone.name, timeZoneName: 'long'}).format(this).split(', ')[1];

    spoofData.date = new ORIGINAL_DATE(toLocaleString.apply(this, [ spoofData.locale, { timeZone: spoofData.zone.name }]));
    spoofData.zoneInfo = {
      offsetStr,
      offsetNum,
      tzAbbr: spoofData.zone.abbrs[offsetIndex],
      tzName
    };
    nd[window.CHAMELEON_SPOOF] = spoofData;
    return nd;
  }
  window.Date.prototype.setUTCMilliseconds = function(...args) {
    let timestamp = this.getTime();
    if (isNaN(timestamp)) {
      return NaN;
    }
    let nd = setUTCMilliseconds.apply(this, args);
    let spoofData = Object.assign({}, CHAMELEON_SPOOF.get(window).timezone);
    let offsetIndex = spoofData.zone.untils.findIndex(o => o === null || (timestamp < o) );
    let offsetNum = spoofData.zone.offsets[offsetIndex];

    let offsetStr = \`\${offsetNum < 0 ? '+' : '-' }\${String(Math.abs(offsetNum / 60)).padStart(2, '0')}\${String(offsetNum % 60).padStart(2, '0')}\`;
    let tzName = ORIGINAL_INTL('en-us', { timeZone: spoofData.zone.name, timeZoneName: 'long'}).format(this).split(', ')[1];

    spoofData.date = new ORIGINAL_DATE(toLocaleString.apply(this, [ spoofData.locale, { timeZone: spoofData.zone.name }]));
    spoofData.zoneInfo = {
      offsetStr,
      offsetNum,
      tzAbbr: spoofData.zone.abbrs[offsetIndex],
      tzName
    };
    nd[window.CHAMELEON_SPOOF] = spoofData;
    return nd;
  }
  window.Date.prototype.setUTCMinutes = function(...args) {
    let timestamp = this.getTime();
    if (isNaN(timestamp)) {
      return NaN;
    }
    let nd = setUTCMinutes.apply(this, args);
    let spoofData = Object.assign({}, CHAMELEON_SPOOF.get(window).timezone);
    let offsetIndex = spoofData.zone.untils.findIndex(o => o === null || (timestamp < o) );
    let offsetNum = spoofData.zone.offsets[offsetIndex];

    let offsetStr = \`\${offsetNum < 0 ? '+' : '-' }\${String(Math.abs(offsetNum / 60)).padStart(2, '0')}\${String(offsetNum % 60).padStart(2, '0')}\`;
    let tzName = ORIGINAL_INTL('en-us', { timeZone: spoofData.zone.name, timeZoneName: 'long'}).format(this).split(', ')[1];

    spoofData.date = new ORIGINAL_DATE(toLocaleString.apply(this, [ spoofData.locale, { timeZone: spoofData.zone.name }]));
    spoofData.zoneInfo = {
      offsetStr,
      offsetNum,
      tzAbbr: spoofData.zone.abbrs[offsetIndex],
      tzName
    };
    nd[window.CHAMELEON_SPOOF] = spoofData;
    return nd;
  }
  window.Date.prototype.setUTCMonth = function(...args) {
    let timestamp = this.getTime();
    if (isNaN(timestamp)) {
      return NaN;
    }
    let nd = setUTCMonth.apply(this, args);
    let spoofData = Object.assign({}, CHAMELEON_SPOOF.get(window).timezone);
    let offsetIndex = spoofData.zone.untils.findIndex(o => o === null || (timestamp < o) );
    let offsetNum = spoofData.zone.offsets[offsetIndex];

    let offsetStr = \`\${offsetNum < 0 ? '+' : '-' }\${String(Math.abs(offsetNum / 60)).padStart(2, '0')}\${String(offsetNum % 60).padStart(2, '0')}\`;
    let tzName = ORIGINAL_INTL('en-us', { timeZone: spoofData.zone.name, timeZoneName: 'long'}).format(this).split(', ')[1];

    spoofData.date = new ORIGINAL_DATE(toLocaleString.apply(this, [ spoofData.locale, { timeZone: spoofData.zone.name }]));
    spoofData.zoneInfo = {
      offsetStr,
      offsetNum,
      tzAbbr: spoofData.zone.abbrs[offsetIndex],
      tzName
    };
    nd[window.CHAMELEON_SPOOF] = spoofData;
    return nd;
  }
  window.Date.prototype.setUTCSeconds = function(...args) {
    let timestamp = this.getTime();
    if (isNaN(timestamp)) {
      return NaN;
    }
    let nd = setUTCSeconds.apply(this, args);
    let spoofData = Object.assign({}, CHAMELEON_SPOOF.get(window).timezone);
    let offsetIndex = spoofData.zone.untils.findIndex(o => o === null || (timestamp < o) );
    let offsetNum = spoofData.zone.offsets[offsetIndex];

    let offsetStr = \`\${offsetNum < 0 ? '+' : '-' }\${String(Math.abs(offsetNum / 60)).padStart(2, '0')}\${String(offsetNum % 60).padStart(2, '0')}\`;
    let tzName = ORIGINAL_INTL('en-us', { timeZone: spoofData.zone.name, timeZoneName: 'long'}).format(this).split(', ')[1];

    spoofData.date = new ORIGINAL_DATE(toLocaleString.apply(this, [ spoofData.locale, { timeZone: spoofData.zone.name }]));
    spoofData.zoneInfo = {
      offsetStr,
      offsetNum,
      tzAbbr: spoofData.zone.abbrs[offsetIndex],
      tzName
    };
    nd[window.CHAMELEON_SPOOF] = spoofData;
    return nd;
  }
  window.Date.prototype.toDateString = function() {
    if (isNaN(this.getTime())) {
      return "Invalid Date";
    }
    return toDateString.apply(this[window.CHAMELEON_SPOOF].date);
  }
  window.Date.prototype.toString = function() {
    if (isNaN(this.getTime())) {
      return "Invalid Date";
    }
    return this.toDateString() + ' ' + this.toTimeString();
  }
  window.Date.prototype.toTimeString = function() {
    if (isNaN(this.getTime())) {
      return "Invalid Date";
    }
    let spoofData = this[window.CHAMELEON_SPOOF];
    let parts = toTimeString.apply(spoofData.date).split(' ', 1);
    parts = parts.concat(['GMT' + spoofData.zoneInfo.offsetStr, \`(\${spoofData.zoneInfo.tzName})\`]);
    return parts.join(' ');
  }
  window.Date.prototype.toJSON = function() {
    if (isNaN(this.getTime())) {
      return null;
    }
    return this.toISOString();
  }
  window.Date.prototype.toLocaleString = function(...args) {
    if (isNaN(this.getTime())) {
      return "Invalid Date";
    }
    
    let tmp = toLocaleString.apply(this[window.CHAMELEON_SPOOF].date, args);
    tmp = tmp.replace(TZ_LONG, this[window.CHAMELEON_SPOOF].zoneInfo.tzName);
    tmp = tmp.replace(TZ_SHORT, this[window.CHAMELEON_SPOOF].zoneInfo.tzAbbr);

    return tmp;
  }
  window.Date.prototype.toLocaleDateString = function(...args) {
    if (isNaN(this.getTime())) {
      return "Invalid Date";
    }

    let tmp = toLocaleDateString.apply(this[window.CHAMELEON_SPOOF].date, args);
    tmp = tmp.replace(TZ_LONG, this[window.CHAMELEON_SPOOF].zoneInfo.tzName);
    tmp = tmp.replace(TZ_SHORT, this[window.CHAMELEON_SPOOF].zoneInfo.tzAbbr);

    return tmp;
  }
  window.Date.prototype.toLocaleTimeString = function(...args) {
    if (isNaN(this.getTime())) {
      return "Invalid Date";
    }

    let tmp = toLocaleTimeString.apply(this[window.CHAMELEON_SPOOF].date, args);
    tmp = tmp.replace(TZ_LONG, this[window.CHAMELEON_SPOOF].zoneInfo.tzName);
    tmp = tmp.replace(TZ_SHORT, this[window.CHAMELEON_SPOOF].zoneInfo.tzAbbr);

    return tmp;
  }
`.replace(
    /ORIGINAL_DATE/g,
    String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
      Math.random()
        .toString(36)
        .substring(Math.floor(Math.random() * 5) + 5)
  ),
};
