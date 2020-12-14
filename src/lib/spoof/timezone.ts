export default {
  type: 'custom',
  data: `
  if (new Date()[spoofContext.CHAMELEON_SPOOF]) {
    spoofContext.Date = Date;
    return;
  }

  let ORIGINAL_DATE = spoofContext.Date;
  
  const {
    getDate, getDay, getFullYear, getHours, getMinutes, getMonth, getTime, getTimezoneOffset,
    setDate, setFullYear, setHours, setMinutes, setMilliseconds, setMonth, setSeconds,
    setTime, toDateString, toLocaleString, toLocaleDateString, toLocaleTimeString, toTimeString
  } = ORIGINAL_DATE.prototype;

  const TZ_LONG_A = new ORIGINAL_DATE(2020, 0, 1).toLocaleDateString(undefined, { timeZoneName: 'long' }).split(', ')[1];
  const TZ_LONG_B = new ORIGINAL_DATE(2020, 6, 1).toLocaleDateString(undefined, { timeZoneName: 'long' }).split(', ')[1];
  const TZ_SHORT_A = new ORIGINAL_DATE(2020, 0, 1).toLocaleDateString(undefined, { timeZoneName: 'short' }).split(', ')[1];
  const TZ_SHORT_B = new ORIGINAL_DATE(2020, 6, 1).toLocaleDateString(undefined, { timeZoneName: 'short' }).split(', ')[1];
  const TZ_INTL = ORIGINAL_INTL('en-us', { timeZone: CHAMELEON_SPOOF.get(spoofContext).timezone.zone.name, timeZoneName: 'long'});
  const TZ_LOCALE_STRING = ORIGINAL_INTL('en-us', {
    timeZone: CHAMELEON_SPOOF.get(spoofContext).timezone.zone.name,
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
    let spoofData = CHAMELEON_SPOOF.get(spoofContext).timezone;
    let offsetIndex = spoofData.zone.untils.findIndex(o => o === null || (timestamp < o) );
    let offsetNum = spoofData.zone.offsets[offsetIndex];

    let offsetStr = \`\${offsetNum < 0 ? '+' : '-' }\${String(Math.abs(offsetNum / 60)).padStart(2, '0')}\${String(offsetNum % 60).padStart(2, '0')}\`;
    let tzName = TZ_INTL.format(d).split(', ')[1];

    let tmp = new ORIGINAL_DATE(TZ_LOCALE_STRING.format(d));

    d[spoofContext.CHAMELEON_SPOOF] = {
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

  spoofContext.Date = function() {
    'use strict';

    let tmp = new ORIGINAL_DATE(...arguments);
    let timestamp = getTime.call(tmp);

    if (isNaN(timestamp)) {
      return tmp;
    }
    
    modifyDate(tmp);
    
    return (this instanceof Date) ? tmp : tmp.toString();
  };

  Object.defineProperty(spoofContext.Date, 'length', {
    configurable: false,
    value: 7
  })
  
  spoofContext.Date.prototype = ORIGINAL_DATE.prototype;
  spoofContext.Date.UTC = ORIGINAL_DATE.UTC;
  spoofContext.Date.now = ORIGINAL_DATE.now;
  spoofContext.Date.parse = ORIGINAL_DATE.parse;

  spoofContext.Date.prototype.getDate = function() {
    if (isNaN(getTime.call(this))) {
      return NaN;
    }
    return getDate.call(this[spoofContext.CHAMELEON_SPOOF].date);
  }
  spoofContext.Date.prototype.getDay = function() {
    if (isNaN(getTime.call(this))) {
      return NaN;
    }
    return getDay.call(this[spoofContext.CHAMELEON_SPOOF].date);
  }
  spoofContext.Date.prototype.getFullYear = function() {
    if (isNaN(getTime.call(this))) {
      return NaN;
    }

    return getFullYear.call(this[spoofContext.CHAMELEON_SPOOF].date);
  }
  spoofContext.Date.prototype.getHours = function(){
    if (isNaN(getTime.call(this))) {
      return NaN;
    }

    return getHours.call(this[spoofContext.CHAMELEON_SPOOF].date);
  }
  spoofContext.Date.prototype.getMinutes = function() {
    if (isNaN(getTime.call(this))) {
      return NaN;
    }

    return getMinutes.call(this[spoofContext.CHAMELEON_SPOOF].date);
  }
  spoofContext.Date.prototype.getMonth = function() {
    if (isNaN(getTime.call(this))) {
      return NaN;
    }

    return getMonth.call(this[spoofContext.CHAMELEON_SPOOF].date);
  }
  spoofContext.Date.prototype.getTimezoneOffset = function() {
    if (isNaN(getTime.call(this))) {
      return NaN;
    }

    if (!this[spoofContext.CHAMELEON_SPOOF]) modifyDate(this);

    return this[spoofContext.CHAMELEON_SPOOF].zoneInfo_offsetNum;
  }
  spoofContext.Date.prototype.setDate = function() {
    if (isNaN(getTime.call(this))) {
      return NaN;
    }

    let nd = setDate.apply(this, arguments);
    if (isNaN(nd)) {
      return "Invalid Date";
    }

    modifyDate(this);
    
    return nd;
  }
  spoofContext.Date.prototype.setFullYear = function() {
    if (isNaN(getTime.call(this))) {
      return NaN;
    }

    let nd = setFullYear.apply(this, arguments);
    if (isNaN(nd)) {
      return "Invalid Date";
    }

    modifyDate(this);

    return nd;
  }
  spoofContext.Date.prototype.setHours = function() {
    if (isNaN(getTime.call(this))) {
      return NaN;
    }

    let nd = setHours.apply(this, arguments);
    if (isNaN(nd)) {
      return "Invalid Date";
    }

    modifyDate(this);

    return nd;
  }
  spoofContext.Date.prototype.setMilliseconds = function() {
    if (isNaN(getTime.call(this))) {
      return NaN;
    }

    let nd = setMilliseconds.apply(this, arguments);
    if (isNaN(nd)) {
      return "Invalid Date";
    }

    modifyDate(this);

    return nd;
  }
  spoofContext.Date.prototype.setMonth = function() {
    if (isNaN(getTime.call(this))) {
      return NaN;
    }

    let nd = setMonth.apply(this, arguments);
    if (isNaN(nd)) {
      return "Invalid Date";
    }

    modifyDate(this);

    return nd;
  }
  spoofContext.Date.prototype.setSeconds = function() {
    if (isNaN(getTime.call(this))) {
      return NaN;
    }

    let nd = setSeconds.apply(this, arguments);
    if (isNaN(nd)) {
      return "Invalid Date";
    }

    modifyDate(this);

    return nd;
  }
  spoofContext.Date.prototype.setTime = function() {
    if (isNaN(getTime.call(this))) {
      return NaN;
    }

    let nd = setTime.apply(this, arguments);
    if (isNaN(nd)) {
      return "Invalid Date";
    }

    modifyDate(this);

    return nd;
  }
  spoofContext.Date.prototype.toDateString = function() {    
    if (isNaN(getTime.call(this))) {
      return "Invalid Date";
    }
    return toDateString.apply(this[spoofContext.CHAMELEON_SPOOF].date);
  }
  spoofContext.Date.prototype.toString = function() {    
    if (isNaN(getTime.call(this))) {
      return "Invalid Date";
    }

    return this.toDateString() + ' ' + this.toTimeString();
  }
  spoofContext.Date.prototype.toTimeString = function() {    
    if (isNaN(getTime.call(this))) {
      return "Invalid Date";
    }

    let parts = toTimeString.apply(this[spoofContext.CHAMELEON_SPOOF].date).split(' ', 1);

    // fix string formatting for negative timestamp
    let tzName;

    if (getTime.call(this) >= 0) {
      tzName = \`(\${this[spoofContext.CHAMELEON_SPOOF].zoneInfo_tzName})\`;
    } else {
      tzName = "(" + TZ_LONG_A + ")";
    }

    parts = parts.concat(['GMT' + this[spoofContext.CHAMELEON_SPOOF].zoneInfo_offsetStr, tzName]);

    return parts.join(' ');
  }
  spoofContext.Date.prototype.toJSON = function() {
    if (isNaN(getTime.call(this))) {
      return null;
    }
    return this.toISOString();
  }
  spoofContext.Date.prototype.toLocaleString = function() {
    if (isNaN(getTime.call(this))) {
      return "Invalid Date";
    }
    
    let tmp = toLocaleString.apply(this[spoofContext.CHAMELEON_SPOOF].date, arguments);

    return replaceName(tmp, this[spoofContext.CHAMELEON_SPOOF].zoneInfo_tzName);
  }
  spoofContext.Date.prototype.toLocaleDateString = function() {
    if (isNaN(getTime.call(this))) {
      return "Invalid Date";
    }

    let tmp = toLocaleDateString.apply(this[spoofContext.CHAMELEON_SPOOF].date, arguments);
    
    return replaceName(tmp, this[spoofContext.CHAMELEON_SPOOF].zoneInfo_tzName);
  }
  spoofContext.Date.prototype.toLocaleTimeString = function() {
    if (isNaN(getTime.call(this))) {
      return "Invalid Date";
    }

    let tmp = toLocaleTimeString.apply(this[spoofContext.CHAMELEON_SPOOF].date, arguments);
    
    return replaceName(tmp, this[spoofContext.CHAMELEON_SPOOF].zoneInfo_tzName);
  }

  modifiedAPIs = modifiedAPIs.concat([
    [spoofContext.Date, "Date"],
    [spoofContext.Date.prototype.getDate, "getDate"],
    [spoofContext.Date.prototype.getDay,  "getDay"],
    [spoofContext.Date.prototype.getFullYear, "getFullYear"],
    [spoofContext.Date.prototype.getHours, "getHours"],
    [spoofContext.Date.prototype.getMinutes, "getMinutes"],
    [spoofContext.Date.prototype.getMonth, "getMonth"],
    [spoofContext.Date.prototype.getTimezoneOffset, "getTimezoneOffset"],
    [spoofContext.Date.prototype.setDate, "setDate"],
    [spoofContext.Date.prototype.setFullYear, "setFullYear"],
    [spoofContext.Date.prototype.setHours, "setHours"],
    [spoofContext.Date.prototype.setMilliseconds, "setMilliseconds"],
    [spoofContext.Date.prototype.setMonth, "setMonth"],
    [spoofContext.Date.prototype.setSeconds, "setSeconds"],
    [spoofContext.Date.prototype.setTime, "setTime"],
    [spoofContext.Date.prototype.toDateString, "toDateString"],
    [spoofContext.Date.prototype.toString, "toString"],
    [spoofContext.Date.prototype.toTimeString, "toTimeString"],
    [spoofContext.Date.prototype.toJSON, "toJSON"],
    [spoofContext.Date.prototype.toLocaleString, "toLocaleString"],
    [spoofContext.Date.prototype.toLocaleDateString, "toLocaleDateString"],
    [spoofContext.Date.prototype.toLocaleTimeString, "toLocaleTimeString"],
  ]);
`.replace(
    /ORIGINAL_DATE/g,
    String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
      Math.random()
        .toString(36)
        .substring(Math.floor(Math.random() * 5) + 5)
  ),
};
