import { getTypeDef } from "@polkadot/types";
import { TypeDefInfo } from "@polkadot/types/types";
import { isBn } from "@polkadot/util";
import { componentDefs } from "../config/component-def";
import Amount from "../views/Components/form-control/Amount.vue";
import Unknown from "../views/Components/form-control/Unknown.vue";

const SPECIAL_TYPES = ["AccountId", "AccountIndex", "Address", "Balance"];

const warnList = [];

const components = componentDefs.reduce((components, { component, types }) => {
  types.forEach(type => {
    components[type] = component;
  });

  return components;
}, {});

function fromDef({ displayName, info, sub, type }) {
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
      if (components[type].name === "Account") {
        return type;
      }

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

export function findComponent(registry, def, overrides = {}) {
  const findOne = type => overrides[type] || components[type];
  const type = fromDef(def);
  let Component = findOne(type);

  if (!Component) {
    let error = null;

    try {
      const instance = registry.createType(type);
      const raw = getTypeDef(instance.toRawType());

      Component = findOne(raw.type);

      if (Component) {
        return Component;
      } else if (isBn(instance)) {
        return Amount;
      } else if (
        [TypeDefInfo.Enum, TypeDefInfo.Struct, TypeDefInfo.Tuple].includes(
          raw.info
        )
      ) {
        return findComponent(registry, raw, overrides);
      } else if (raw.info === TypeDefInfo.VecFixed && raw.sub.type !== "u8") {
        return findComponent(registry, raw, overrides);
      }
    } catch (e) {
      error = e.message;
    }

    // we only want to want once, not spam
    if (!warnList.includes(type)) {
      warnList.push(type);
      error && console.error(`params: findComponent: ${error}`);
      console.info(
        `params: findComponent: No pre-defined component for type ${type} from ${JSON.stringify(
          def
        )}, using defaults`
      );
    }
  }

  return Component || Unknown;
}
