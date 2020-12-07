export function assert(condition, msg) {
  if (!condition) throw new Error(`[Apior] ${msg}`)
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
export function getTokenDecimalByCurrency(token) {
  if (token) {
    return token.tokenDecimals;
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
