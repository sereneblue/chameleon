export default {
  type :  'custom',
  data :  `
  var ORIGINAL_DATE = window.Date;
  
  const {
    getDate, getDay, getFullYear, getHours, getMinutes, getMonth, getTime, getTimezoneOffset,
    setDate, setFullYear, setHours, setMinutes, setMilliseconds, setMonth, setSeconds,
    setTime, toDateString, toLocaleString, toLocaleDateString, toLocaleTimeString, toTimeString
  } = ORIGINAL_DATE.prototype;

  const TZ_LONG_A = new ORIGINAL_DATE(2020, 0, 1).toLocaleDateString(undefined, { timeZoneName: 'long' }).split(', ')[1];
  const TZ_LONG_B = new ORIGINAL_DATE(2020, 6, 1).toLocaleDateString(undefined, { timeZoneName: 'long' }).split(', ')[1];
  const TZ_SHORT_A = new ORIGINAL_DATE(2020, 0, 1).toLocaleDateString(undefined, { timeZoneName: 'short' }).split(', ')[1];
  const TZ_SHORT_B = new ORIGINAL_DATE(2020, 6, 1).toLocaleDateString(undefined, { timeZoneName: 'short' }).split(', ')[1];
  const TZ_INTL = ORIGINAL_INTL('en-us', { timeZone: CHAMELEON_SPOOF.get(window).timezone.zone.name, timeZoneName: 'long'});
  const TZ_LOCALE_STRING = ORIGINAL_INTL('en-us', {
    timeZone: CHAMELEON_SPOOF.get(window).timezone.zone.name,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  });
  const TZ_DIFF = 3 * 60 * 60 * 1000;

  const modifyDate = (d) => {
    let timestamp = getTime.call(d);
    let spoofData = CHAMELEON_SPOOF.get(window).timezone;
    let offsetIndex = spoofData.zone.untils.findIndex(o => o === null || (timestamp < o) );
    let offsetNum = spoofData.zone.offsets[offsetIndex];

    let offsetStr = \`\${offsetNum < 0 ? '+' : '-' }\${String(Math.abs(offsetNum / 60)).padStart(2, '0')}\${String(offsetNum % 60).padStart(2, '0')}\`;
    let tzName = TZ_INTL.format(d).split(', ')[1];

    let tmp = new ORIGINAL_DATE(TZ_LOCALE_STRING.format(d));

    d[window.CHAMELEON_SPOOF] = {
      date: tmp,
      zoneInfo_offsetNum: offsetNum,
      zoneInfo_offsetStr: offsetStr,
      zoneInfo_tzAbbr: spoofData.zone.abbrs[offsetIndex],
      zoneInfo_tzName: tzName
    };
  }

  const replaceName = (d, name) => {
    d = d.replace(TZ_LONG_A, name);
    d = d.replace(TZ_LONG_B, name);
    d = d.replace(TZ_SHORT_A, name);
    d = d.replace(TZ_SHORT_B, name);

    return d;
  }

  window.Date = function(...args) {
    let tmp = new ORIGINAL_DATE(...args);
    let timestamp = getTime.call(tmp);

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
    if (isNaN(getTime.call(this))) {
      return NaN;
    }
    return getDate.call(this[window.CHAMELEON_SPOOF].date);
  }
  window.Date.prototype.getDay = function() {
    if (isNaN(getTime.call(this))) {
      return NaN;
    }
    return getDay.call(this[window.CHAMELEON_SPOOF].date);
  }
  window.Date.prototype.getFullYear = function() {
    if (isNaN(getTime.call(this))) {epochConverterGMTString
      return NaN;
    }

    return getFullYear.call(this[window.CHAMELEON_SPOOF].date);
  }
  window.Date.prototype.getHours = function(){
    if (isNaN(getTime.call(this))) {
      return NaN;
    }

    return getHours.call(this[window.CHAMELEON_SPOOF].date);
  }
  window.Date.prototype.getMinutes = function() {
    if (isNaN(getTime.call(this))) {
      return NaN;
    }

    return getMinutes.call(this[window.CHAMELEON_SPOOF].date);
  }
  window.Date.prototype.getMonth = function() {
    if (isNaN(getTime.call(this))) {
      return NaN;
    }

    return getMonth.call(this[window.CHAMELEON_SPOOF].date);
  }
  window.Date.prototype.getTimezoneOffset = function() {
    if (isNaN(getTime.call(this))) {
      return NaN;
    }

    if (!this[window.CHAMELEON_SPOOF]) modifyDate(this);

    return this[window.CHAMELEON_SPOOF].zoneInfo_offsetNum;
  }
  window.Date.prototype.setDate = function(...args) {
    if (isNaN(getTime.call(this))) {
      return NaN;
    }
    let nd = setDate.apply(this, args);

    modifyDate(this);
    
    return nd;
  }
  window.Date.prototype.setFullYear = function(...args) {
    let timestamp = getTime.call(this);
    if (isNaN(timestamp)) {
      return NaN;
    }

    let nd = setFullYear.apply(this, args);

    modifyDate(this);

    return nd;
  }
  window.Date.prototype.setHours = function(...args) {
    let timestamp = getTime.call(this);
    if (isNaN(timestamp)) {
      return NaN;
    }
    let nd = setHours.apply(this, args);

    modifyDate(this);

    return nd;
  }
  window.Date.prototype.setMilliseconds = function(...args) {
    let timestamp = getTime.call(this);
    if (isNaN(timestamp)) {
      return NaN;
    }
    let nd = setMilliseconds.apply(this, args);

    modifyDate(this);

    return nd;
  }
  window.Date.prototype.setMonth = function(...args) {
    let timestamp = getTime.call(this);
    if (isNaN(timestamp)) {
      return NaN;
    }
    let nd = setMonth.apply(this, args);

    modifyDate(this);

    return nd;
  }
  window.Date.prototype.setSeconds = function(...args) {
    let timestamp = getTime.call(this);
    if (isNaN(timestamp)) {
      return NaN;
    }
    let nd = setSeconds.apply(this, args);

    modifyDate(this);

    return nd;
  }
  window.Date.prototype.setTime = function(...args) {
    let timestamp = getTime.call(this);
    if (isNaN(timestamp)) {
      return NaN;
    }
    let nd = setTime.apply(this, args);

    modifyDate(this);

    return nd;
  }
  window.Date.prototype.toDateString = function() {
    if (isNaN(getTime.call(this))) {
      return "Invalid Date";
    }
    return toDateString.apply(this[window.CHAMELEON_SPOOF].date);
  }
  window.Date.prototype.toString = function() {
    if (isNaN(getTime.call(this))) {
      return "Invalid Date";
    }
    return this.toDateString() + ' ' + this.toTimeString();
  }
  window.Date.prototype.toTimeString = function() {
    if (isNaN(getTime.call(this))) {
      return "Invalid Date";
    }

    let parts = toTimeString.apply(this[window.CHAMELEON_SPOOF].date).split(' ', 1);
    parts = parts.concat(['GMT' + this[window.CHAMELEON_SPOOF].zoneInfo_offsetStr, \`(\${this[window.CHAMELEON_SPOOF].zoneInfo_tzName})\`]);
    return parts.join(' ');
  }
  window.Date.prototype.toJSON = function() {
    if (isNaN(getTime.call(this))) {
      return null;
    }
    return this.toISOString();
  }
  window.Date.prototype.toLocaleString = function(...args) {
    if (isNaN(getTime.call(this))) {
      return "Invalid Date";
    }
    
    let tmp = toLocaleString.apply(this[window.CHAMELEON_SPOOF].date, args);

    return replaceName(tmp, this[window.CHAMELEON_SPOOF].zoneInfo_tzName);
  }
  window.Date.prototype.toLocaleDateString = function(...args) {
    if (isNaN(getTime.call(this))) {
      return "Invalid Date";
    }

    let tmp = toLocaleDateString.apply(this[window.CHAMELEON_SPOOF].date, args);
    
    return replaceName(tmp, this[window.CHAMELEON_SPOOF].zoneInfo_tzName);
  }
  window.Date.prototype.toLocaleTimeString = function(...args) {
    if (isNaN(getTime.call(this))) {
      return "Invalid Date";
    }

    let tmp = toLocaleTimeString.apply(this[window.CHAMELEON_SPOOF].date, args);
    
    return replaceName(tmp, this[window.CHAMELEON_SPOOF].zoneInfo_tzName);
  }
`.replace(
    /ORIGINAL_DATE/g,
    String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
      Math.random()
        .toString(36)
        .substring(Math.floor(Math.random() * 5) + 5)
  ),
};
