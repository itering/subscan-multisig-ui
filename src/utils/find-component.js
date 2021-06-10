import { TypeDefInfo } from "@polkadot/types/types";
import { componentDefs } from "../config/component-def";

const SPECIAL_TYPES = ["AccountId", "AccountIndex", "Address", "Balance"];

export const components = componentDefs.reduce(
  (components, { component, types }) => {
    types.forEach(type => {
      components[type] = component;
    });

    return components;
  },
  {}
);

export function fromDef({ displayName, info, sub, type }) {
  if (displayName && SPECIAL_TYPES.includes(displayName)) {
    return displayName;
  }

  switch (info) {
    case TypeDefInfo.Compact:
      return sub.type;

    case TypeDefInfo.Option:
      return "Option";

    case TypeDefInfo.Enum:
      return "Enum";

    case TypeDefInfo.Struct:
      return "Struct";

    case TypeDefInfo.Tuple:
      //       if (components[type] === Account) {
      //         return type;
      //       }

      return "Tuple";

    case TypeDefInfo.Vec:
      if (type === "Vec<u8>") {
        return "Bytes";
      }

      return ["Vec<KeyValue>"].includes(type) ? "Vec<KeyValue>" : "Vec";

    case TypeDefInfo.VecFixed:
      if (sub.type === "u8") {
        return type;
      }

      return "VecFixed";

    default:
      return type;
  }
}
