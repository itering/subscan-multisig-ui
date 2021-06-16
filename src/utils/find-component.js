import { getTypeDef } from "@polkadot/types";
import { TypeDefInfo } from "@polkadot/types/types";
import { isBn } from "@polkadot/util";
import { Input } from "element-ui";
import Account from "../views/Components/form-control/Account.vue";
import Amount from "../views/Components/form-control/Amount.vue";
import Balance from "../views/Components/form-control/Balance.vue";
import Bool from "../views/Components/form-control/Bool.vue";
import Bytes from "../views/Components/form-control/Bytes.vue";
import Hash160 from "../views/Components/form-control/Hash160.vue";
import Hash256 from "../views/Components/form-control/Hash256.vue";
import Hash512 from "../views/Components/form-control/Hash512.vue";
import Option from "../views/Components/form-control/Option.vue";
import Unknown from "../views/Components/form-control/Unknown.vue";

const componentDefs = [
  { component: Account, types: ["AccountId", "Address", "LookupSource"] },
  {
    component: Amount,
    types: [
      "AccountIndex",
      "i8",
      "i16",
      "i32",
      "i64",
      "i128",
      "u8",
      "u16",
      "u32",
      "u64",
      "u128",
      "u256"
    ]
  },
  { component: Balance, types: ["Amount", "Balance", "BalanceOf"] },
  { component: Bool, types: ["bool"] },
  { component: Bytes, types: ["Bytes"] },
  { component: Input, types: ["Call", "Proposal"] },
  { component: Input, types: ["Code"] },
  { component: Input, types: ["DispatchError"] },
  { component: Input, types: ["DispatchResult"] },
  { component: Input, types: ["Raw", "Keys"] },
  { component: Input, types: ["Enum"] },
  { component: Hash256, types: ["Hash", "H256"] },
  { component: Hash160, types: ["H160"] },
  { component: Hash512, types: ["H512"] },
  { component: Input, types: ["KeyValue"] },
  { component: Input, types: ["Vec<KeyValue>"] },
  { component: Input, types: ["Moment", "MomentOf"] },
  { component: Input, types: ["Null"] },
  { component: Input, types: ["OpaqueCall"] },
  { component: Option, types: ["Option"] },
  { component: Input, types: ["String", "Text"] },
  { component: Input, types: ["Struct"] },
  { component: Input, types: ["Tuple"] },
  { component: Input, types: ["Vec"] },
  { component: Input, types: ["VecFixed"] },
  { component: Input, types: ["Vote"] },
  { component: Input, types: ["VoteThreshold"] },
  { component: Input, types: ["Unknown"] }
];

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
