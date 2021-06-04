import { ApiPromise, WsProvider } from "@polkadot/api";
import keyring from "@polkadot/ui-keyring";
import { cryptoWaitReady } from '@polkadot/util-crypto';
import store from "Plugins/store";
import { ENDPOINTS_MAP } from "Config";
import { TypeRegistry } from '@polkadot/types/create';
import { Metadata } from '@polkadot/metadata';
import metaStatic from '@polkadot/metadata/static';
import { toUpperCaseFirst } from '../utils/tools';

let apiInstance = {};
const registry = new TypeRegistry();
const metadata = new Metadata(registry, metaStatic);

registry.setMetadata(metadata);

async function connectWS() {
  const network = store.state.global.sourceSelected
  const { wss, types, isDarwinia } = ENDPOINTS_MAP[network];
  const provider = new WsProvider(wss);
  const typeConfig = isDarwinia ? { 
    typesBundle: {
      spec: { 
        [toUpperCaseFirst(network)]: types
      }
    },
  } : { registry };

  apiInstance = new ApiPromise({
    provider,
    ...typeConfig,
  });

  if(!isDarwinia) {
    apiInstance.injectMetadata(metadata, true);
  }

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
