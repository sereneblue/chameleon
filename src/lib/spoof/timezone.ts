export default {
  type: 'custom',
  data: `
  var ORIGINAL_DATE = window.Date;
  var ORIGINAL_INTL = window.Intl.DateTimeFormat;
  
  const {
    getDate, getDay, getFullYear, getHours, getMinutes, getMonth, getTimezoneOffset,
    setDate, setFullYear, setHours, setMinutes, setMilliseconds, setMonth,
    setUTCDate, setUTCFullYear, setUTCHours, setUTCMinutes, setUTCMilliseconds, setUTCMonth,
    setUTCSeconds, toDateString, toLocaleString, toLocaleDateString, toLocaleTimeString, toTimeString
  } = ORIGINAL_DATE.prototype;

  const supportedLocalesOf = ORIGINAL_INTL.supportedLocalesOf;

  window.Date = function(...args) {
    let tmp = this instanceof Date ? new ORIGINAL_DATE(...args) : new ORIGINAL_DATE();
    let timestamp = tmp.getTime();
    if (isNaN(timestamp)) {
      return "Invalid Date";
    }
    let spoofData = Object.assign({}, CHAMELEON_SPOOF.get(window).timezone);
    let offsetIndex = spoofData.zone.untils.findIndex(o => o === null || (timestamp < o) );
    let offsetNum = spoofData.zone.offsets[offsetIndex];

    let offsetStr = \`\${offsetNum < 0 ? '+' : '-' }\${String(Math.abs(offsetNum / 60)).padStart(2, '0')}\${String(offsetNum % 60).padStart(2, '0')}\`;
    let tzName = ORIGINAL_INTL('en-us', { timeZone: spoofData.zone.name, timeZoneName: 'long'}).format(tmp).split(', ')[1];
    
    spoofData.date = new ORIGINAL_DATE(toLocaleString.apply(tmp, [ spoofData.locale, { timeZone: spoofData.zone.name }]));
    spoofData.zoneInfo = {
      offsetStr,
      offsetNum,
      tzAbbr: spoofData.zone.abbrs[offsetIndex],
      tzName
    };

    tmp[window.CHAMELEON_SPOOF] = spoofData;

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
    return getFullYear.apply(this[window.CHAMELEON_SPOOF].date);
  }
  window.Date.prototype.getHours = function(){
    if (isNaN(this.getTime())) {
      return NaN;
    }
    return getHours.apply(this[window.CHAMELEON_SPOOF].date);
  }
  window.Date.prototype.getMinutes = function() {
    if (isNaN(this.getTime())) {
      return NaN;
    }
    return getMinutes.apply(this[window.CHAMELEON_SPOOF].date);
  }
  window.Date.prototype.getMonth = function() {
    if (isNaN(this.getTime())) {
      return NaN;
    }
    return getMonth.apply(this[window.CHAMELEON_SPOOF].date);
  }
  window.Date.prototype.getTimezoneOffset = function() {
    if (isNaN(this.getTime())) {
      return NaN;
    }
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
  window.Date.prototype.toISOString = function() {
    if (isNaN(this.getTime())) {
      return "Invalid Date";
    }
    return this.getUTCFullYear() + '-' + ('0'+(this.getUTCMonth()+1)).slice(-2) + '-' + ('0'+(this.getUTCDate())).slice(-2) + 'T' + 
        ('0'+(this.getUTCHours())).slice(-2) + ':' + ('0'+(this.getUTCMinutes())).slice(-2) + ':' + ('0'+(this.getUTCSeconds())).slice(-2) + '.' + String((this.getUTCMilliseconds()/1000).toFixed(3)).slice(2,5) + 'Z';
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
    return toLocaleString.apply(args.length < 2 ? this[window.CHAMELEON_SPOOF].date : this, args);
  }
  window.Date.prototype.toLocaleDateString = function(...args) {
    if (isNaN(this.getTime())) {
      return "Invalid Date";
    }
    return toLocaleDateString.apply(this[window.CHAMELEON_SPOOF].date, args);
  }
  window.Date.prototype.toLocaleTimeString = function(...args) {
    if (isNaN(this.getTime())) {
      return "Invalid Date";
    }
    return toLocaleTimeString.apply(this[window.CHAMELEON_SPOOF].date, args);
  }

  window.Intl.DateTimeFormat = function(...args) {
    let locale = navigator.language || "en-US";
    let spoofData = Object.assign({}, CHAMELEON_SPOOF.get(window).timezone);

    if (args.length == 2) {
      if (!args[1].timeZone) {
        args[1].timeZone = spoofData.zone.name;
      }
      if (!args[1].locale) {
        args[1].locale = locale;
      }
    } else if (args.length == 1) {
      args.push({
        timeZone: spoofData.zone.name
      });
    } else {
      args = [
        locale,
        { timeZone: spoofData.zone.name }
      ];
    }

    return ORIGINAL_INTL.apply(null, args);
  }

`
    .replace(
      /ORIGINAL_DATE/g,
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
        Math.random()
          .toString(36)
          .substring(Math.floor(Math.random() * 5) + 5)
    )
    .replace(
      /ORIGINAL_INTL/g,
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
        Math.random()
          .toString(36)
          .substring(Math.floor(Math.random() * 5) + 5)
    ),
};
