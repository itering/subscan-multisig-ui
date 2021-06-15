import { hexToU8a, isHex, u8aToString } from "@polkadot/util";

const BYTE_STR_0 = "0".charCodeAt(0);
const BYTE_STR_X = "x".charCodeAt(0);
const STR_NL = "\n";

export function convertResult(result) {
  const data = new Uint8Array(result);

  // this converts the input (if detected as hex), via the hex conversion route
  if (data[0] === BYTE_STR_0 && data[1] === BYTE_STR_X) {
    let hex = u8aToString(data);

    while (hex[hex.length - 1] === STR_NL) {
      hex = hex.substr(0, hex.length - 1);
    }

    if (isHex(hex)) {
      return hexToU8a(hex);
    }
  }

  return data;
}
