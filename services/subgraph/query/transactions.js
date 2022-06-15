import { gql } from '@urql/core';

const PairTokensFragment = gql`
  fragment PairTokensFragment on Pair {
    token0 {
      id
      symbol
      derivedUSD
    }
    token1 {
      id
      symbol
      derivedUSD
    }
  }
`;

export const OverviewTransactionsQuery = gql`
query OverviewTransactionsQuery ($first: Int = 50) {
  transactions(first: $first, orderBy: timestamp, orderDirection: desc) {
    id
    timestamp
    swaps {
      amount0In
      amount0Out
      amount1In
      amount1Out
      from
      pair {
        ...PairTokensFragment
      }
    }
    mints {
      amount0
      amount1
      to
      pair {
        ...PairTokensFragment
      }
    }
    burns {
      amount0
      amount1
      to
      pair {
        ...PairTokensFragment
      }
    }
  }
}
${PairTokensFragment}
`;

export const TransactionsByPairsQuery = gql`
query TransactionsByPairsQuery ($pairs: [String!]) {
  transactions(orderBy: timestamp, orderDirection: desc) {
    id
    timestamp
    swaps(
      where: { pair_in: $pairs }
    ) {
      amount0In
      amount0Out
      amount1In
      amount1Out
      from
      pair {
        ...PairTokensFragment
      }
    }
    mints(
      where: { pair_in: $pairs }
    ) {
      amount0
      amount1
      to
      pair {
        ...PairTokensFragment
      }
    }
    burns(
      where: { pair_in: $pairs }
    ) {
      amount0
      amount1
      to
      pair {
        ...PairTokensFragment
      }
    }
  }
}
${PairTokensFragment}
`;
