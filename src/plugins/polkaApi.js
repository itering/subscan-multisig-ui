import { ApiPromise, WsProvider } from "@polkadot/api";
import keyring from "@polkadot/ui-keyring";
import { cryptoWaitReady } from '@polkadot/util-crypto';
import store from "Plugins/store";
import { ENDPOINTS_MAP } from "Config";
let apiInstance = {};

async function connectWS() {
  let WS_PROVIDER = ENDPOINTS_MAP[store.state.global.sourceSelected].wss;
  const provider = new WsProvider(WS_PROVIDER);
  apiInstance = new ApiPromise({
    provider,
    types: ENDPOINTS_MAP[store.state.global.sourceSelected].types
  });
  await apiInstance.isReady;
  cryptoWaitReady().then(() => {
    keyring.loadAll({ type: 'sr25519' });
    store.commit("SET_KEYRING_STATUS", true);
  });
}
connectWS();

export default apiInstance;
