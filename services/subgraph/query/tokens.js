import { gql } from '@urql/core';

export const OverviewTokensQuery = gql`
query OverviewTokensQuery($timestamp: Int) {
  tokens {
    id
    name
    symbol
    tradeVolume
    totalLiquidity
    derivedUSD
    dayData(orderBy: timestamp, orderDirection: desc, where: {timestamp_gte: $timestamp}) {
      dailyVolumeToken
      priceUSD
    }
  }
}
`;

export const TokenPairsQuery = gql`
query TokenPairsQuery($id: ID!) {
  token(id: $id) {
    pairBase {
      id
    }
    pairQuote {
      id
    }
  }
}
`;