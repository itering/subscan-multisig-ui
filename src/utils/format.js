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
