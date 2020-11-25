const BigNumber = require('bignumber.js')
import _ from "lodash"
export function getNumb() {
  var num = new Array();
  for (var i = 0; i < 10; i++) {
    var val = Math.ceil(Math.random() * 30);
    var isEqu = false;
    for (var idx in num) {
      if (num[idx] == val) {
        isEqu = true;
        break;
      }
    }
    if (isEqu) i--;
    else num[num.length] = val;
  }
  return num;
}

// scrollTop animation
export function scrollTop(el, from = 0, to, duration = 500) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil(difference / duration * 50);

  function scroll(start, end, step) {
    if (start === end) return;

    let d = (start + step > end) ? end : start + step;
    if (start > end) {
      d = (start - step < end) ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  }
  scroll(from, to, step);
}

export function calStrSize(string) {
  let total = 0,
    charCode,
    i,
    len;
  let str = string;
  if (!str) {
    return 0;
  }
  if (!_.isString(string)) {
    str = JSON.stringify(string);
  }
  for (i = 0, len = str.length; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode <= 0x007f) {
      total += 1;
    } else if (charCode <= 0x07ff) {
      total += 2;
    } else if (charCode <= 0xffff) {
      total += 3;
    } else {
      total += 4;
    }
  }
  return total;
}
export function assert(condition, msg) {
  if (!condition) throw new Error(`[Apior] ${msg}`)
}

export function emailValidate(str) {
  let reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
  return reg.test(str)
}
export function passwordValidate(str) {
  let reg = /^[a-zA-Z]{2,}[a-zA-Z0-9_]{6,}/
  return reg.test(str)
}
export function activedCodedValidate(str) {
  let reg = /^[0-9]{6}$/
  return reg.test(str)
}
export function phoneNumberValidate(str) {
  let reg = /^1[3|4|5|8][0-9]\d{4,8}$/
  return reg.test(str)
}

export function deepCopy(o) {
  if (o instanceof Array) {
    let n = [];
    for (let i = 0; i < o.length; ++i) {
      n[i] = deepCopy(o[i]);
    }
    return n;
  } else if (o instanceof Function) {
    let n = new Function("return " + o.toString())();
    return n
  } else if (o instanceof Object) {
    let n = {}
    for (let i in o) {
      n[i] = deepCopy(o[i]);
    }
    return n;
  } else {
    return o;
  }
}

export function deepAssign(n, o) {
  if (o instanceof Array) {
    for (let i = 0; i < o.length; ++i) {
      n[i] = deepCopy(o[i]);
    }
    return n;
  } else if (o instanceof Function) {
    n = new Function("return " + o.toString())();
    return n
  } else if (o instanceof Object) {
    for (let i in o) {
      n[i] = deepAssign(n[i], o[i]);
    }
    return n;
  } else {
    return o;
  }
}

// 对象数组排序
export function sortObject(array, key) {
  let temp = array.sort(function (a, b) {
    return new BigNumber(findProp(a, key)).gt(findProp(b, key)) ? -1 : 1
  })
  return temp
}

// 递归查找对象属性
export function findProp(o, key) {
  if (o[key]) {
    return o[key]
  } else {
    var n = undefined
    for (var i in o) {
      if (o[i] instanceof Object) {
        n = findProp(o[i], key);
      }
    }
    return n;
  }
}

/**
 * 节流函数
 * @param method 事件触发的操作
 * @param mustRunDelay 间隔多少毫秒需要触发一次事件
 */
export function throttle(method, mustRunDelay) {
  let timer,
    args = arguments,
    start;
  return function loop() {
    let self = this;
    let now = Date.now();
    if (!start) {
      start = now;
    }
    if (timer) {
      clearTimeout(timer);
    }
    if (now - start >= mustRunDelay) {
      method.apply(self, args);
      start = now;
    } else {
      timer = setTimeout(function () {
        loop.apply(self);
      }, 50);
    }
  }
}

/**
 * 防抖函数
 * @param method 事件触发的操作
 * @param delay 多少毫秒内连续触发事件，不会执行
 * @returns {Function}
 */
export function debounce(method, delay) {
  let timer = null;
  return function () {
    let self = this,
      args = arguments;
    timer && clearTimeout(timer);
    timer = setTimeout(function () {
      method.apply(self, args);
    }, delay);
  }
}

export function openwin(url) {
  const a = document.createElement("a"); //创建a对象
  a.setAttribute("href", url);
  a.setAttribute("target", "_blank");
  a.setAttribute("id", "camnpr");
  document.body.appendChild(a);
  a.click(); //执行当前对象
}

/**
 * 返回UTC时间字符串
 * @param date 时间
 * @returns utc时间
 */

export function toUTC(date) {
  // 确保date 最终为Date object
  date = new Date(date);
  // 加入"+08"来标示对应的时区
  return date.toISOString();
}

export function isMobile() {
  const u = navigator.userAgent;
  return (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) &&
      !!u.match(/AppleWebKit.*Mobile.*/)) ||
    window.innerWidth <= 768;
}
export function getCurrencyTokenDetail(token, sourceSelected, currency) {
  if (token && token.detail && token.token) {
    if (sourceSelected !== "crab" && sourceSelected !== "darwinia") {
      return token.detail[token.token[0]];
    } else {
      return token.detail[currency.toUpperCase()] || token.detail['C' + currency.toUpperCase()];
    }
  }
  return {};
}

export function getTokenDetail(token, sourceSelected) {
  if (token && token.detail && token.token) {
    if (sourceSelected !== "crab" && sourceSelected !== "darwinia") {
      return token.detail[token.token[0]];
    } else {
      return token.detail['POWER'];
    }
  }
  return {};
}
export function getTokenDecimalByCurrency(token) {
  if (token) {
    return token.tokenDecimals;
  }
  return 0;
}
export function getTokenDecimal(token) {
  if (token) {
    return token.token_decimals;
  }
  return 0;
}
export function formatSymbol(module, $const, sourceSelected, params={}) {
  if (!$const[`SYMBOL/${sourceSelected}`]) {
    return "";
  }
  if (params.isValidate && (sourceSelected === 'crab' || sourceSelected === 'darwinia')) {
    return $const[`SYMBOL/${sourceSelected}`]['power'] && $const[`SYMBOL/${sourceSelected}`]['power'].value || "";
  } else {
    return $const[`SYMBOL/${sourceSelected}`][module] && $const[`SYMBOL/${sourceSelected}`][module].value || "";
  }
}
