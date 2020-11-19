import keyring from "@polkadot/ui-keyring";
import { cryptoWaitReady } from '@polkadot/util-crypto';
import store from "Plugins/store";
let apiInstance = {};

async function connectWS() {
  cryptoWaitReady().then(() => {
    keyring.loadAll({ type: 'sr25519', isDevelopment: true });
    store.commit("SET_KEYRING_STATUS", true);
  });
}
connectWS();

export default apiInstance;
