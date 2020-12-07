import {bnShift, bn2str} from "./format";
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
