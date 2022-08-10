import { createClient, defaultExchanges } from '@urql/core';

// localhost
// http://localhost:8000/subgraphs/name/klaytn-subgraph/exchange
// https://graph.ipfs1.dev.infra.soramitsu.co.jp/subgraphs/name/klaytn-subgraph/exchange

const SubgraphClient = createClient({
  url: process.env.subgraphEndpoint,
  // the default:
  exchanges: defaultExchanges,
  requestPolicy: 'network-only',
});

export default SubgraphClient;
