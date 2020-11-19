const BigNumber = require('bignumber.js')
BigNumber.config({ EXPONENTIAL_AT: [-12, 20]})
export function fmtNumber(number, decimals) {
  decimals = parseInt(decimals)
  let str = new BigNumber(number).toFixed( isNaN(decimals) ? 8 : decimals, 1);
  return str.length > 10 ? str.substr(0, 10) : str
}
export function fmtNumber4Digits(number, decimals=4) {
  decimals = parseInt(decimals)
  let str = new BigNumber(number).dp(decimals).toNumber();
  return str
}
export function fmtNumber2exp(number) {
  let str = new BigNumber(number).toExponential();
  return str
}
export function bnShift(number, shift) {
  shift = parseInt(shift)
  return new BigNumber(number).shiftedBy(shift).toNumber();
}
export function bnDp(number, digit) {
  digit = parseInt(digit)
  return new BigNumber(number).dp(digit).toNumber();
}
export function getCommission(perf, accuracy) {
  if (isNaN(accuracy)) {
    return perf;
  }
  return fmtPercentage(bnShift(perf, -accuracy), 1, 2) + '%';
}
export function bnDiv(a, b) {
  return new BigNumber(a).div(new BigNumber(b));
}
export function bnMinus(a, b) {
  return new BigNumber(a).minus(new BigNumber(b));
}

export function bnPlus(a, b) {
  return new BigNumber(a).plus(new BigNumber(b));
}

export function bn2str(number) {
  return new BigNumber(number).toString(10);
}

export function fmtPercentage(number, total, decimals) {
  decimals = parseInt(decimals);
  let str = new BigNumber(number).div(new BigNumber(total)).multipliedBy(100).toFixed( isNaN(decimals)  ? 8 : decimals, 1);
  return str.length > 10 ? str.substr(0, 10) : str
}

export function fmtDate(date) {
  date = new Date(date);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  var h = date.getHours();
  var m1 = date.getMinutes();
  m = m < 10 ? ("0" + m) : m;
  d = d < 10 ? ("0" + d) : d;
  h = h < 10 ? ("0" + h) : h;
  m1 = m1 < 10 ? ("0" + m1) : m1;
  return y + "-" + m + "-" + d + " " + h + ":" + m1;
}
