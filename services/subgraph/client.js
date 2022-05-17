import { createClient, defaultExchanges } from '@urql/core';

const SubgraphClient = createClient({
  url: 'https://graph.ipfs1.dev.infra.soramitsu.co.jp/subgraphs/name/klaytn-subgraph/exchange',
  // the default:
  exchanges: defaultExchanges,
});

export default SubgraphClient;
