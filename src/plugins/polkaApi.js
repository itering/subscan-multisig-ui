import { ApiPromise, WsProvider } from "@polkadot/api";
import keyring from "@polkadot/ui-keyring";
import { cryptoWaitReady } from '@polkadot/util-crypto';
import store from "Plugins/store";
import { ENDPOINTS_MAP } from "Config";
import { TypeRegistry } from '@polkadot/types/create';
let apiInstance = {};
let registry = new TypeRegistry();
async function connectWS() {
  let WS_PROVIDER = ENDPOINTS_MAP[store.state.global.sourceSelected].wss;
  const provider = new WsProvider(WS_PROVIDER);
  apiInstance = new ApiPromise({
    provider,
    registry,
    types: ENDPOINTS_MAP[store.state.global.sourceSelected].types
  });
  await apiInstance.isReady;

  const chainState = await apiInstance.rpc.system.properties();
  store.commit("SET_TOKEN", chainState.toJSON());
  const {ss58Format, tokenDecimals, tokenSymbol} = chainState;
  registry.setChainProperties(registry.createType('ChainProperties', { ss58Format, tokenDecimals, tokenSymbol }));
  cryptoWaitReady().then(() => {
    keyring.loadAll({
      genesisHash: apiInstance.genesisHash,
      type: 'sr25519',
      ss58Format: ss58Format
    });
    store.commit("SET_KEYRING_STATUS", true);
  });
}
connectWS();

export default { apiInstance, registry };
