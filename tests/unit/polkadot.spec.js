const { ApiPromise, WsProvider } = require('@polkadot/api');

describe("@polkadot/api", () => {
  test("should connect to polkadot Node", async () => {
    const provider = new WsProvider('wss://rpc.polkadot.io');
    const api = await ApiPromise.create({ provider });
    const chain = await api.rpc.system.chain()
    expect(chain.toString()).toBe('Polkadot');
  }, 30000);
});
