import Account from "../views/Components/form-control/Account.vue";
import { Input,InputNumber } from "element-ui";

export const componentDefs = [
  { component: Account, types: ["AccountId", "Address", "LookupSource"] },
  { component: Input, types: ['AccountIndex', 'i8', 'i16', 'i32', 'i64', 'i128', 'u8', 'u16', 'u32', 'u64', 'u128', 'u256'] },
  { component: InputNumber, types: ['Amount', 'Balance', 'BalanceOf'] },
  { component: Input, types: ['bool'] },
  { component: Input, types: ['Bytes'] },
  { component: Input, types: ['Call', 'Proposal'] },
  { component: Input, types: ['Code'] },
  { component: Input, types: ['DispatchError'] },
  { component: Input, types: ['DispatchResult'] },
  { component: Input, types: ['Raw', 'Keys'] },
  { component: Input, types: ['Enum'] },
  { component: Input, types: ['Hash', 'H256'] },
  { component: Input, types: ['H160'] },
  { component: Input, types: ['H512'] },
  { component: Input, types: ['KeyValue'] },
  { component: Input, types: ['Vec<KeyValue>'] },
  { component: Input, types: ['Moment', 'MomentOf'] },
  { component: Input, types: ['Null'] },
  { component: Input, types: ['OpaqueCall'] },
  { component: Input, types: ['Option'] },
  { component: Input, types: ['String', 'Text'] },
  { component: Input, types: ['Struct'] },
  { component: Input, types: ['Tuple'] },
  { component: Input, types: ['Vec'] },
  { component: Input, types: ['VecFixed'] },
  { component: Input, types: ['Vote'] },
  { component: Input, types: ['VoteThreshold'] },
  { component: Input, types: ['Unknown'] }
];
