import {bnShift, bn2str} from "./format";
import { encodeAddress } from "@polkadot/util-crypto";
export function toThousandslsFilter(num) {
  return (num || 0)
    .toString()
    .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
}

export function accuracyFormat(num, accuracy) {
  if (accuracy) {
    return bn2str(bnShift(num, -accuracy));
  } else if (+accuracy === 0){
    return num;
  } else {
    return '';
  }
}

export function encodeAddressByType(address, addressType) {
  if (!address) {
    return "";
  }
  return encodeAddress(address, addressType);
}

export function hashFormat(hash) {
  if (hash === "") {
    return "";
  }
  if (hash.length > 12) {
    return `${hash.slice(0, 7)}....${hash.slice(-5)}`;
  } else {
    return hash;
  }
}
