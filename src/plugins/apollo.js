import ApolloClient from "apollo-boost";
import { ENDPOINTS_MAP } from "Config";

const configs = Object.entries(ENDPOINTS_MAP).map(([key, value]) => ({
  name: key,
  ...value
}));

export const apolloClients = configs
  .map(({ api: { subql }, name }) => ({
    [name]: new ApolloClient({ uri: subql })
  }))
  .reduce((acc, cur) => ({ ...acc, ...cur }), {});

export const defaultClient = new ApolloClient({ uri: "http://localhost:3000/api" });
