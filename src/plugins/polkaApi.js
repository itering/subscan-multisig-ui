import { ApiPromise, WsProvider } from "@polkadot/api";
import keyring from "@polkadot/ui-keyring";
import { cryptoWaitReady } from '@polkadot/util-crypto';
import store from "Plugins/store";
import { ENDPOINTS_MAP } from "Config";
import { TypeRegistry } from '@polkadot/types/create';
import { Metadata } from '@polkadot/metadata';
import metaStatic from '@polkadot/metadata/static';
let apiInstance = {};
let registry = new TypeRegistry();
const metadata = new Metadata(registry, metaStatic);
registry.setMetadata(metadata);
async function connectWS() {
  let WS_PROVIDER = ENDPOINTS_MAP[store.state.global.sourceSelected].wss;
  const provider = new WsProvider(WS_PROVIDER);
  apiInstance = new ApiPromise({
    provider,
    registry,
    types: ENDPOINTS_MAP[store.state.global.sourceSelected].types
  });
  apiInstance.injectMetadata(metadata, true);
  await apiInstance.isReady;

  const chainState = await apiInstance.rpc.system.properties();
  store.commit("SET_TOKEN", chainState.toHuman());
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
